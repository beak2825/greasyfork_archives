// ==UserScript==
// @name         Vanis Parties
// @namespace    none
// @description  none
// @license      none
// @version      1.0.2
// @author       Eva#5121
// @match        https://vanis.io/*
// @grant        unsafeWindow
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/448023/Vanis%20Parties.user.js
// @updateURL https://update.greasyfork.org/scripts/448023/Vanis%20Parties.meta.js
// ==/UserScript==

class Reader {
  offset = 0;

  constructor(arrayBuffer, LE = true) {
    this.view = new DataView(arrayBuffer);
    this.offset = 0;
    this.LE = LE;
  }

  skip = bytes => ((this.offset += bytes), this);
  readUint8 = () => this.view.getUint8(this.offset++);
  readUint16 = LE => ((this.offset += 2), this.view.getUint16(this.offset - 2, LE ?? this.LE));
  readUint32 = LE => ((this.offset += 4), this.view.getUint32(this.offset - 4, LE ?? this.LE));
  readInt8 = () => this.view.getInt8(this.offset++);
  readInt16 = LE => ((this.offset += 2), this.view.getInt16(this.offset - 2, LE ?? this.LE));
  readInt32 = LE => ((this.offset += 4), this.view.getInt32(this.offset - 4, LE ?? this.LE));
  readFloat32 = LE => ((this.offset += 4), this.view.getFloat32(this.offset - 4, LE ?? this.LE));
  readFloat64 = LE => ((this.offset += 8), this.view.getFloat64(this.offset - 8, LE ?? this.LE));
  readBytes = length => ((this.offset += length), this.view.buffer.slice(this.offset - length, this.offset));

  readString(unicode = false) {
    const method = unicode ? this.readUint16 : this.readUint8;
    let string = '';
    let charCode = method();

    while (charCode !== 0) {
      string += String.fromCharCode(charCode);
      charCode = method();
    }

    return string;
  }
}
class Writer {
  constructor(length, offset = 0) {
    this.view = new DataView(new ArrayBuffer(length));
    this.offset = offset;
  }

  skip = bytes => ((this.offset += bytes), this);
  writeUint8 = value => (this.view.setUint8(this.offset++, value), this);
  writeUint16 = value => ((this.offset += 2), this.view.setUint16(this.offset - 2, value, true), this);
  writeUint32 = value => ((this.offset += 4), this.view.setUint32(this.offset - 4, value, true), this);
  writeInt8 = value => (this.view.setInt8(this.offset++, value), this);
  writeInt16 = value => ((this.offset += 2), this.view.setInt16(this.offset - 2, value, true), this);
  writeInt32 = value => ((this.offset += 4), this.view.setInt32(this.offset - 4, value, true), this);
  writeFloat32 = value => ((this.offset += 4), this.view.setFloat32(this.offset - 4, value, true), this);
  writeFloat64 = value => ((this.offset += 8), this.view.setFloat64(this.offset - 8, value, true), this);

  writeString(string, unicode = false) {
    const method = unicode ? this.writeUint16 : this.writeUint8;
    Array.from(string).forEach(char => method(char.charCodeAt(0)));
    method(0);
    return this;
  }

  get raw() {
    return this.view;
  }
}

/**
 *
 * @param {keyof HTMLElementTagNameMap} el element tag name e.g. 'div'
 * @param {{ [key:string]: string }} attrs attributes array to be applied to new element
 * @param  {...(string|Node)[]} append children to apply
 * @returns {HTMLElement} HTMLElement
 */
function newElement(el, attrs = {}, ...append) {
  const element = document.createElement(el);

  Object.entries(attrs).forEach(([key, val]) => element.setAttribute(key, val));

  element.append(...append);

  return element;
}

const WebSocket = window.WebSocket;

const partySpan = newElement('span', {}, 'Party');
const totalMass = newElement('span', {}, '0');
const title = newElement(
  'div',
  { style: `display:flex;flex-direction:row;justify-content:space-between;flex:1;font-weight:bold;margin-bottom:5px;letter-spacing:1px;` },
  partySpan,
  totalMass
);

const members = newElement('div', { style: `display:flex;flex-direction:column;font-size:12px` });

const hud = newElement(
  'div',
  {
    style: `white-space:nowrap;display:flex;flex-direction:column;position:absolute;top:2px;background:rgba(0,0,0,.45);border-radius:4px;pointer-events:none;border:1px solid white;padding:5px;min-width:150px;left:1025px;box-sizing:border-box;font-size:15px;`,
  },
  title,
  members
);

const createMember = (nickname, mass, color) =>
  newElement(
    'div',
    { style: `display:flex;flex-direction:row;justify-content:space-between;flex:1` },
    newElement('span', { style: `margin-right: 15px;color:${color}` }, nickname),
    newElement('span', {}, mass)
  );
const formatUrl = url => url.replace('wss://', '').replace(/\/$/, '');

class ApiConnection {
  constructor(_) {
    this._ = _;
    this.toast = Swal.mixin({ toast: true, position: 'top', showConfirmButton: false, showCloseButton: true });
    this.v = 1;
    this.url = 'wss://vanis-parties.herokuapp.com';
    this.massMap = new Map();
    /** @type {WebSocket} */
    this.ws = null;
    this.interval = 0;
    this.lastBoop = 0;

    this.idlePacket = new Writer(2 + 4 + 8 + 1).writeUint8(2).writeString('null').writeUint16(0).writeUint16(0).writeUint32(0).writeUint8(0).raw.buffer;
    this.boot();
  }

  get account() {
    return this._.app.$children[6].$children[2].account;
  }
  get connected() {
    return this.interval !== 0;
  }
  get allowed() {
    return this._ && this.account?.discord_id;
  }

  getMass(pid) {
    const mass = this.massMap.get(pid);
    if (mass === -1) return 'SPEC';
    if (mass === 0) return 'DEAD';
    return mass ?? '????';
  }

  head = () => fetch(this.url.replace('wss', 'https').replace('ws', 'http'), { method: 'HEAD' });

  boot = () => {
    if (!this.allowed) {
      members.textContent = 'Not logged in, retrying...';
      return setTimeout(this.boot, 1000);
    }
    members.textContent = 'Waking up the server';

    this.head()
      .then(() => this.connect())
      .catch(() => {
        members.textContent = 'Waking up failed, re-trying';
        setTimeout(this.boot, 1000);
      });
  };

  connect = () => {
    if (!this.allowed) {
      members.textContent = 'Not logged in, retrying...';
      return setTimeout(this.connect, 1000);
    }
    members.textContent = 'Connecting to the server';
    this.ws = new WebSocket(this.url);
    this.ws.binaryType = 'arraybuffer';
    this.ws.onopen = this.onopen;
    this.ws.onclose = this.onclose;
    this.ws.onmessage = ({ data }) => this.onmessage(new Reader(data));
  };

  onopen = () => {
    const id = this.account?.discord_id;
    if (!id) {
      members.textContent = 'Not logged in';
      return this.ws.close(4000);
    }
    members.textContent = 'Logging in...';
    this.ws.send(new Writer(3 + id.length).writeUint8(1).writeString(id).writeUint8(this.v).raw.buffer);
  };

  onclose = e => {
    clearInterval(this.interval);
    this.interval = 0;

    if (e.code === 1008) {
      members.textContent = 'Update required';
      return this.toast.fire({ title: '[Parties] Old script version, please update', type: 'error' });
    }

    if (e.code === 1002 || e.code === 1003) {
      members.textContent = 'Server is updating or new version is coming';
      return this.toast.fire({ title: '[Parties] Protocol error\nWait for new version or a server fix', type: 'error' });
    }

    members.textContent = 'Disconnected, retrying';
    setTimeout(this.connect, 1000);

    console.log('Party disconnected', e);
  };
  /** @param {Reader} data */
  onmessage = data => {
    const opcode = data.readUint8();

    switch (opcode) {
      case 1: {
        this.interval = setInterval(this.sendData, 888);
        this.lastBoop = Date.now();
        members.textContent = '';
        break;
      }
      case 2: {
        this.massMap.clear();

        let amount = data.readUint8();
        while (--amount !== -1) {
          const [pid, mass, flags] = [data.readUint16(), data.readUint32(), data.readUint8()];
          if (flags & 1) this.massMap.set(pid, -1);
          else this.massMap.set(pid, mass);
        }

        break;
      }
      default: {
        console.log('invalid opcode received: ' + opcode);
      }
    }
  };

  sendData = () => {
    // keep free tier server alive because apparently alive websocket connections are not a good reason to not shut down due to inactivity
    if (this.lastBoop + 10 * 60 * 1000 <= Date.now()) {
      const temp = this.lastBoop;
      this.lastBoop = Date.now(); // incase the next sendData is called before this request is done
      this.head()
        .then(() => console.log('booped successfully'))
        .catch(e => console.log('boop failed', e, (this.lastBoop = temp + 60000)));
    }

    if (!this._) return;
    if (!this._.ws || this._.ws.readyState !== WebSocket.OPEN || !this._.activePid) return void this.ws.send(this.idlePacket);

    const url = formatUrl(this._.ws.url);
    const tagId = this._.tagId || 0;

    const pid = this._.pid || this._.activePid;
    const mass = this._.score || 0;
    const flags = Number(this._.spectating);

    const multi = this._.minion;
    const summed = settings.minionMode === false && !!multi && multi.mass > 0 && mass > 0;

    const sendMass = Math.max(0, summed ? mass - multi.mass : mass);

    const data = new Writer(2 + url.length + 2 + (2 + 4 + 1) * (multi ? 2 : 1))
      .writeUint8(2)
      .writeString(url)
      .writeUint16(tagId)
      .writeUint16(pid)
      .writeUint32(sendMass)
      .writeUint8(flags);
    if (multi) {
      data
        .writeUint16(multi.pid || 0)
        .writeUint32(multi.mass || 0)
        .writeUint8(0);
    }

    this.ws.send(data.raw.buffer);
  };
}

const init = _ => {
  document.getElementById('hud').append(hud);

  const partyConnection = new ApiConnection(_);
  _.partyConnection = partyConnection;

  const tick = () => {
    if (!partyConnection.connected || !_) return;
    if (!_?.playerManager?.players) return (members.textContent = 'Not on a server');
    if (!_.tagId) return (members.textContent = 'Party can only be in a tag');
    members.textContent = '';

    while (members.children.length) members.removeChild(members.firstChild);

    let massSum = 0;
    const elements = Object.values(_.playerManager.players)
      .filter(player => player.tagId === _.tagId)
      .map(({ pid, name, nameColorCss }) => {
        const color = nameColorCss || '#ffffff';
        const mass = partyConnection.getMass(pid);
        if (typeof mass === 'number') massSum += mass;
        return createMember(name, mass, color);
      });

    totalMass.textContent = massSum;

    members.append(...elements);
  };

  tick();
  setInterval(tick, 1000);
};

const c = Function.prototype.call;
Function.prototype.call = function (t, ...a) {
  if (t === a[1] && typeof a[2] === 'function') {
    const e = this;

    function f() {
      e.apply(this, arguments);

      members.textContent = 'Please log in';
      const _ = arguments[2](1);
      const g = _.app.$children[6].$children[2].setAccountData;
      _.app.$children[6].$children[2].setAccountData = function () {
        init(_);
        _.app.$children[6].$children[2].setAccountData = g;
        return g.apply(this, arguments);
      };
    }

    Function.prototype.call = c;
    return c.apply(f, arguments);
  }
  return c.apply(this, arguments);
};
