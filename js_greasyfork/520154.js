// ==UserScript==
// @name        SendToClient
// @namespace   NotMareks Scripts
// @description Painlessly send torrents to your bittorrent client.
// @match       *://*.gazellegames.net/*
// @match       *://*.animebytes.tv/*
// @match       *://*.orpheus.network/*
// @match       *://*.passthepopcorn.me/*
// @match       *://*.greatposterwall.com/*
// @match       *://*.redacted.sh/*
// @match       *://*.jpopsuki.eu/*
// @match       *://*.tv-vault.me/*
// @match       *://*.sugoimusic.me/*
// @match       *://*.ianon.app/*
// @match       *://*.alpharatio.cc/*
// @match       *://*.uhdbits.org/*
// @match       *://*.morethantv.me/*
// @match       *://*.empornium.is/*
// @match       *://*.deepbassnine.com/*
// @match       *://*.broadcasthe.net/*
// @match       *://*.secret-cinema.pw/*
// @match       *://*.blutopia.cc/*
// @match       *://*.aither.cc/*
// @match       *://*.desitorrents.tv/*
// @match       *://*.jptv.club/*
// @match       *://*.telly.wtf/*
// @match       *://*.torrentseeds.org/*
// @match       *://*.torrentleech.org/*
// @match       *://*.www.torrentleech.org/*
// @match       *://*.anilist.co/*
// @match       *://*.karagarga.in/*
// @match       *://*.beyond-hd.me/*
// @version     2.3.1
// @author      notmarek
// @require     https://cdn.jsdelivr.net/combine/npm/@violentmonkey/dom@2,npm/@violentmonkey/ui@0.7
// @grant       GM.getValue
// @grant       GM.registerMenuCommand
// @grant       GM.setValue
// @grant       GM.unregisterMenuCommand
// @grant       GM.xmlHttpRequest
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/520154/SendToClient.user.js
// @updateURL https://update.greasyfork.org/scripts/520154/SendToClient.meta.js
// ==/UserScript==

(function () {
'use strict';

const XFetch = {
  post: async (url, data, headers = {}) => {
    return new Promise((resolve, reject) => {
      GM.xmlHttpRequest({
        method: 'POST',
        url,
        headers,
        data,
        onload: res => {
          resolve({
            json: async () => JSON.parse(res.responseText),
            text: async () => res.responseText,
            headers: async () => Object.fromEntries(res.responseHeaders.split('\r\n').map(h => h.split(': '))),
            raw: res
          });
        }
      });
    });
  },
  get: async url => {
    return new Promise((resolve, reject) => {
      GM.xmlHttpRequest({
        method: 'GET',
        url,
        headers: {
          Accept: 'application/json'
        },
        onload: res => {
          resolve({
            json: async () => JSON.parse(res.responseText),
            text: async () => res.responseText,
            headers: async () => Object.fromEntries(res.responseHeaders.split('\r\n').map(h => h.split(': '))),
            raw: res
          });
        }
      });
    });
  }
};

const addTorrent = async (torrentUrl, clientUrl, username, password, client, path, category) => {
  let implementations = {
    qbit: async () => {
      XFetch.post(`${clientUrl}/api/v2/auth/login`, `username=${username}&password=${password}`, {
        'content-type': 'application/x-www-form-urlencoded'
      });
      let tor_data = new FormData();
      tor_data.append('urls', torrentUrl);
      if (path) {
        tor_data.append('savepath', path);
      }
      tor_data.append('category', category);
      XFetch.post(`${clientUrl}/api/v2/torrents/add`, tor_data);
    },
    trans: async (session_id = null) => {
      let headers = {
        Authorization: `Basic ${btoa(`${username}:${password}`)}`,
        'Content-Type': 'application/json'
      };
      if (session_id) headers['X-Transmission-Session-Id'] = session_id;
      let res = await XFetch.post(`${clientUrl}/transmission/rpc`, JSON.stringify({
        arguments: {
          filename: torrentUrl,
          'download-dir': path
        },
        method: 'torrent-add'
      }), headers);
      if (res.raw.status === 409) {
        implementations.trans((await res.headers())['X-Transmission-Session-Id']);
      }
    },
    flood: async () => {
      // login
      XFetch.post(`${clientUrl}/api/auth/authenticate`, JSON.stringify({
        password,
        username
      }), {
        'content-type': 'application/json'
      });
      XFetch.post(`${clientUrl}/api/torrents/add-urls`, JSON.stringify({
        urls: [torrentUrl],
        destination: path,
        start: true
      }), {
        'content-type': 'application/json'
      });
    },
    deluge: async () => {
      XFetch.post(`${clientUrl}/json`, JSON.stringify({
        method: 'auth.login',
        params: [password],
        id: 0
      }), {
        'content-type': 'application/json'
      });
      let res = await XFetch.post(`${clientUrl}/json`, JSON.stringify({
        method: 'web.download_torrent_from_url',
        params: [torrentUrl],
        id: 1
      }), {
        'content-type': 'application/json'
      });
      XFetch.post(`${clientUrl}/json`, JSON.stringify({
        method: 'web.add_torrents',
        params: [[{
          path: (await res.json()).result,
          options: {
            add_paused: false,
            download_location: path
          }
        }]],
        id: 2
      }), {
        'content-type': 'application/json'
      });
    },
    rutorrent: async () => {
      // credit to humeur
      let headers = {
        Authorization: `Basic ${btoa(`${username}:${password}`)}`
      };
      const response = await fetch(torrentUrl);
      const data = await response.blob();
      let form = new FormData();
      form.append('torrent_file[]', data, 'sendtoclient.torrent');
      form.append('torrents_start_stopped', 'true');
      form.append('dir_edit', path);
      form.append('label', category);
      XFetch.post(`${clientUrl}/rutorrent/php/addtorrent.php?json=1`, form, headers);
    }
  };
  await implementations[client]();
};
async function testClient(clientUrl, username, password, client) {
  let clients = {
    trans: async () => {
      let headers = {
        Authorization: `Basic ${btoa(`${username}:${password}`)}`,
        'Content-Type': 'application/json',
        'X-Transmission-Session-Id': null
      };
      let res = await XFetch.post(`${clientUrl}/transmission/rpc`, null, headers);
      if (res.raw.status !== 401) {
        return true;
      }
      return false;
    },
    qbit: async () => {
      let res = await XFetch.post(`${clientUrl}/api/v2/auth/login`, `username=${username}&password=${password}`, {
        'content-type': 'application/x-www-form-urlencoded',
        cookie: 'SID='
      });
      if ((await res.text()) === 'Ok.') {
        return true;
      }
      return false;
    },
    deluge: async () => {
      let res = await XFetch.post(`${clientUrl}/json`, JSON.stringify({
        method: 'auth.login',
        params: [password],
        id: 0
      }), {
        'content-type': 'application/json'
      });
      try {
        if ((await res.json()).result) {
          return true;
        }
      } catch (e) {
        return false;
      }
      return false;
    },
    flood: async () => {
      let res = await XFetch.post(`${clientUrl}/api/auth/authenticate`, JSON.stringify({
        password,
        username
      }), {
        'content-type': 'application/json'
      });
      try {
        if ((await res.json()).success) return true;
      } catch (e) {
        return false;
      }
      return false;
    },
    rutorrent: async () => {
      // credit to humeur
      let headers = {
        Authorization: `Basic ${btoa(`${username}:${password}`)}`,
        'Content-Type': 'application/json'
      };
      let res = await XFetch.post(`${clientUrl}/rutorrent/php/addtorrent.php?json=1`, null, headers);
      if (res.raw.status !== 401) {
        return true;
      }
      return false;
      // credit to humeur;
    }
  };

  let result = await clients[client]();
  return result;
}
// TODO: new implementation - there should be a class for each client implementating the needed methods
const getCategories = async (clientUrl, username, password) => {
  XFetch.post(`${clientUrl}/api/v2/auth/login`, `username=${username}&password=${password}`, {
    'content-type': 'application/x-www-form-urlencoded'
  });
  let res = await XFetch.get(`${clientUrl}/api/v2/torrents/categories`);
  try {
    return Object.keys(await res.json());
  } catch (_unused) {
    return [];
  }
};
async function detectClient(url) {
  const res = await XFetch.get(url);
  const body = await res.text();
  const headers = await res.headers();
  if (headers.hasOwnProperty('WWW-Authenticate')) {
    const wwwAuthenticateHeader = headers['WWW-Authenticate'];
    if (wwwAuthenticateHeader.includes('"Transmission"')) return 'trans';
  }
  if (body.includes('<title>Deluge ')) return 'deluge';
  if (body.includes('<title>Flood</title>')) return 'flood';
  if (body.includes('<title>qBittorrent ')) return 'qbit';
  if (body.includes('ruTorrent ')) return 'rutorrent';
  return 'unknown';
}

class Profile {
  constructor(id, name, host, username, password, client, saveLocation, category, linkedTo = []) {
    this.id = id;
    this.name = name;
    this.host = host;
    this.username = username;
    this.password = password;
    this.client = client;
    this.saveLocation = saveLocation;
    this.category = category;
    this.linkedTo = linkedTo;
  }
  async linkTo(site, replace = false) {
    let alreadyLinkedTo = profileManager.profiles.find(p => p.linkedTo.includes(site));
    if (alreadyLinkedTo && !replace) {
      return alreadyLinkedTo.name;
    } else if (alreadyLinkedTo && replace) {
      alreadyLinkedTo.unlinkFrom(site);
    }
    if (this.linkedTo.includes(site)) return true;
    this.linkedTo.push(site);
    profileManager.save();
    return true;
  }
  async unlinkFrom(site) {
    this.linkedTo = this.linkedTo.filter(s => s !== site);
    profileManager.save();
  }
  async getCategories() {
    if (this.client != 'qbit') return [];
    let res = await getCategories(this.host, this.username, this.password);
    console.log(res);
    return res;
  }
  async testConnection() {
    return await testClient(this.host, this.username, this.password, this.client);
  }
  async addTorrent(torrent_uri) {
    return await addTorrent(torrent_uri, this.host, this.username, this.password, this.client, this.saveLocation, this.category);
  }
}
const profileManager = {
  profiles: [],
  selectedProfile: null,
  addProfile: function (profile) {
    this.profiles.push(profile);
  },
  removeProfile: function (id) {
    this.profiles = this.profiles.find(p => p.id === id);
  },
  getProfile: function (id) {
    var _this$profiles$find;
    return (_this$profiles$find = this.profiles.find(p => Number(p.id) === Number(id))) != null ? _this$profiles$find : new Profile(id, 'New Profile', '', '', '', 'none', '', '');
  },
  getProfiles: function () {
    if (this.profiles.length === 0) this.load();
    return this.profiles;
  },
  setSelectedProfile: function (id) {
    this.selectedProfile = this.getProfile(id);
    window.dispatchEvent(new CustomEvent('profileChanged', {
      detail: this.selectedProfile
    }));
  },
  setProfile: function (profile) {
    if (!this.profiles.includes(this.getProfile(profile.id))) {
      this.profiles.push(profile);
    } else {
      this.profiles = this.profiles.map(p => {
        if (p.id === profile.id) {
          p = profile;
        }
        return p;
      });
    }
  },
  getNextId: function () {
    if (this.profiles.length === 0) return 0;
    return Number(this.profiles.sort((a, b) => Number(b.id) > Number(a.id))[0].id) + 1;
  },
  save: function () {
    GM.setValue('profiles', JSON.stringify(this.profiles));
    GM.setValue('selectedProfile', this.selectedProfile.id);
  },
  load: async function () {
    var _this$getProfile, _Number;
    const profiles = await GM.getValue('profiles');
    if (profiles) {
      this.profiles = JSON.parse(profiles).map(p => {
        var _p$category, _p$linkedTo;
        return new Profile(p.id, p.name, p.host, p.username, p.password, p.client, p.saveLocation, (_p$category = p.category) != null ? _p$category : '', (_p$linkedTo = p.linkedTo) != null ? _p$linkedTo : []);
      });
    }
    for (const profile of this.profiles) {
      for (const site of profile.linkedTo) {
        if (location.href.includes(site)) {
          this.selectedProfile = profile;
          return;
        }
      }
    }
    this.selectedProfile = (_this$getProfile = this.getProfile((_Number = Number(await GM.getValue('selectedProfile'))) != null ? _Number : 0)) != null ? _this$getProfile : new Profile(0, 'New Profile', '', '', '', 'none', '', '');
  }
};

var styles = {"title":"style-module_title__Hei5S","desc":"style-module_desc__LACEI","settings":"style-module_settings__N-vGX","wrapper":"style-module_wrapper__qBEFA","select_input":"style-module_select_input__b12Je"};
var stylesheet=".style-module_title__Hei5S{font-size:20px;font-weight:700;line-height:24px;margin-bottom:10px;text-align:center}.style-module_desc__LACEI{--tw-text-opacity:1;color:rgb(22 163 74/var(--tw-text-opacity))}.style-module_settings__N-vGX{grid-row-gap:1rem;grid-column-gap:1rem;display:grid;grid-template-columns:1fr 1fr}:host{align-items:center;backdrop-filter:blur(5px);display:flex;height:100%;justify-content:center;left:0;position:fixed;top:0;width:100%;z-index:99999999999}.style-module_wrapper__qBEFA{border-radius:10px;padding:20px}.style-module_select_input__b12Je{background-color:#fff;border:1px solid grey;height:20px;position:relative}.style-module_select_input__b12Je>select{border:none;bottom:0;left:0;margin:0;position:absolute;top:0;width:100%}.style-module_select_input__b12Je>input{border:none;left:0;padding:1px;position:absolute;top:0;width:calc(100% - 20px)}";

const ButtonTypes = {
  simple: 0,
  extended: 1
};
const globalSettingsManager = {
  settings: {
    button_type: ButtonTypes.simple
  },
  get button_type() {
    return this.settings.button_type;
  },
  set button_type(val) {
    this.settings.button_type = val;
    this.save();
  },
  async load() {
    let settings = await GM.getValue('settings');
    if (settings) {
      this.settings = JSON.parse(settings);
    }
  },
  async save() {
    await GM.setValue('settings', JSON.stringify(this.settings));
  }
};

const clientSelectorOnChange = (e, shadow) => {
  if (shadow.querySelector('#host').value === '' && e.target.value !== 'unknown') shadow.querySelector('#host').value = e.target.value === 'flood' ? document.location.href.replace(/\/overview|login\/$/, '') : document.location.href.replace(/\/$/, '');
  shadow.querySelector('#category').hidden = e.target.value !== 'qbit';
  shadow.querySelector("label[for='category']").hidden = e.target.value !== 'qbit';
  if (e.target.value === 'qbit') {
    shadow.querySelector('#category>select').onload();
  }
  shadow.querySelector("label[for='username']").hidden = e.target.value === 'deluge';
  shadow.querySelector('#username').hidden = e.target.value === 'deluge';
};
function ClientSelector({
  shadow
}) {
  return VM.h(VM.Fragment, null, VM.h("label", {
    for: "client"
  }, "Client:"), VM.h("select", {
    id: "client",
    name: "client",
    onchange: e => clientSelectorOnChange(e, shadow)
  }, VM.h("option", {
    value: "none",
    default: true
  }, "None"), VM.h("option", {
    value: "deluge"
  }, "Deluge"), VM.h("option", {
    value: "flood"
  }, "Flood"), VM.h("option", {
    value: "qbit"
  }, "qBittorrent"), VM.h("option", {
    value: "trans"
  }, "Transmission"), VM.h("option", {
    value: "rutorrent"
  }, "ruTorrent"), VM.h("option", {
    value: "unknown",
    hidden: true
  }, "Not supported by auto detect")));
}
const profileOnSave = (e, shadow) => {
  let profile = profileManager.getProfile(shadow.querySelector('#profile').value);
  profile.host = shadow.querySelector('#host').value;
  profile.username = shadow.querySelector('#username').value;
  profile.password = shadow.querySelector('#password').value;
  profile.client = shadow.querySelector('#client').value;
  profile.saveLocation = shadow.querySelector('#saveLocation').value;
  profile.name = shadow.querySelector('#profilename').value;
  profile.category = shadow.querySelector('#category>input').value;
  profileManager.setSelectedProfile(profile.id);
  profileManager.setProfile(profile);
  profileManager.save();
  shadow.querySelector('#profile').innerHTML = null;
  shadow.querySelector('#profile').appendChild(VM.m(VM.h(VM.Fragment, null, profileManager.getProfiles().map(p => {
    return VM.h("option", {
      selected: p.id === profileManager.selectedProfile.id,
      value: p.id
    }, p.name);
  }), VM.h("option", {
    value: profileManager.getNextId()
  }, "New profile"))));
};
const addSiteToProfile = async (hostname, shadow) => {
  let result = await profileManager.selectedProfile.linkTo(hostname);
  if (result !== true && confirm(`This site is already linked to "${result}". Do you want to replace it?`)) profileManager.selectedProfile.linkTo(hostname, true);
  profileSelectHandler({
    target: shadow.querySelector('#profile')
  }, shadow);
};
function profileSelectHandler(e, shadow) {
  const profile = profileManager.getProfile(e.target.value);
  profileManager.setSelectedProfile(profile.id);
  shadow.querySelector('#host').value = profile.host;
  shadow.querySelector('#username').value = profile.username;
  shadow.querySelector('#password').value = profile.password;
  shadow.querySelector('#client').value = profile.client;
  shadow.querySelector('#saveLocation').value = profile.saveLocation;
  shadow.querySelector('#profilename').value = profile.name;
  shadow.querySelector('#linkToSite').innerHTML = null;
  shadow.querySelector('#linkToSite').appendChild(VM.m(VM.h(VM.Fragment, null, profileManager.selectedProfile.linkedTo.map(site => VM.h("option", {
    value: site
  }, site)), profileManager.selectedProfile.linkedTo.includes(location.hostname) ? null : VM.h("option", {
    value: location.hostname
  }, "Link to this site."))));
  shadow.querySelector('select#client').onchange({
    target: shadow.querySelector('select#client')
  });
}
function ProfileSelector({
  shadow
}) {
  return VM.h(VM.Fragment, null, VM.h("label", {
    for: "profile"
  }, "Profile:"), VM.h("select", {
    id: "profile",
    name: "profile",
    onchange: e => profileSelectHandler(e, shadow)
  }, profileManager.getProfiles().map(p => {
    return VM.h("option", {
      selected: p.id === profileManager.selectedProfile.id,
      value: p.id
    }, p.name);
  }), VM.h("option", {
    value: profileManager.getNextId()
  }, "New profile")));
}
async function loadCategories(shadow) {
  let options = await profileManager.selectedProfile.getCategories().then(e => e.map(cat => VM.h("option", {
    value: cat,
    selected: profileManager.selectedProfile.category === cat
  }, cat)));
  options.push(VM.h("option", {
    value: "",
    default: true,
    selected: profileManager.selectedProfile.category === ''
  }, "Default"));
  shadow.querySelector('#category>input').value = profileManager.selectedProfile.category;
  shadow.querySelector('select[name="category"]').innerHTML = null;
  shadow.querySelector('select[name="category"]').appendChild(VM.m(VM.h(VM.Fragment, null, options)));
}
function CategorySelector({
  shadow,
  hidden
}) {
  return VM.h(VM.Fragment, null, VM.h("label", {
    for: "category",
    hidden: hidden
  }, "Category:"), VM.h("div", {
    id: "category",
    hidden: hidden,
    className: styles.select_input
  }, VM.h("select", {
    name: "category",
    onload: () => loadCategories(shadow),
    onchange: e => shadow.querySelector('#category>input').value = e.target.value
  }), VM.h("input", {
    type: "text",
    name: "category"
  })));
}
function LinkToSite({
  shadow
}) {
  return VM.h(VM.Fragment, null, VM.h("label", {
    for: "linkToSite"
  }, "Linked to:"), VM.h("select", {
    onchange: async e => {
      if (profileManager.selectedProfile.linkedTo.includes(e.target.value)) confirm('Do you want to unlink this site?') && profileManager.selectedProfile.unlinkFrom(e.target.value);else await addSiteToProfile(e.target.value, shadow);
    },
    id: "linkToSite",
    name: "linkToSite"
  }, profileManager.selectedProfile.linkedTo.map(site => VM.h("option", {
    value: site
  }, site)), profileManager.selectedProfile.linkedTo.includes(location.hostname) ? null : VM.h("option", {
    value: location.hostname
  }, "Link to this site.")));
}
function SettingsElement({
  panel
}) {
  const shadow = panel.root;
  return VM.h(VM.Fragment, null, VM.h("div", {
    className: styles.title
  }, "SendToClient"), VM.h("div", null, VM.h("div", {
    className: styles.settings
  }, VM.h("label", {
    for: "btn-type",
    title: "Toggles whatever you want to choose a profile while sending a torrent"
  }, "Advanced button:"), VM.h("input", {
    name: "btn-type",
    type: "checkbox",
    title: "Change will be applied after a page reload",
    onchange: e => globalSettingsManager.button_type = Number(e.target.checked),
    checked: globalSettingsManager.button_type ? true : false
  })), VM.h("form", {
    className: styles.settings,
    onsubmit: async e => {
      e.preventDefault();
      profileOnSave(e, shadow);
      return false;
    }
  }, VM.h(ProfileSelector, {
    shadow: shadow
  }), VM.h(LinkToSite, {
    shadow: shadow
  }), VM.h(ClientSelector, {
    shadow: shadow
  }), VM.h("label", {
    for: "profilename"
  }, "Profile name:"), VM.h("input", {
    type: "text",
    id: "profilename",
    name: "profilename"
  }), VM.h("label", {
    for: "host"
  }, "Host:"), VM.h("input", {
    type: "text",
    id: "host",
    name: "host"
  }), VM.h("label", {
    for: "username"
  }, "Username:"), VM.h("input", {
    type: "text",
    id: "username",
    name: "username"
  }), VM.h("label", {
    for: "password"
  }, "Password:"), VM.h("input", {
    type: "password",
    id: "password",
    name: "password"
  }), VM.h(CategorySelector, {
    hidden: profileManager.selectedProfile.client !== 'qbit',
    shadow: shadow
  }), VM.h("label", {
    for: "saveLocation"
  }, "Save location:"), VM.h("input", {
    type: "text",
    id: "saveLocation",
    name: "saveLocation"
  }), VM.h("button", {
    onclick: async e => {
      e.preventDefault();
      shadow.querySelector('select#client').value = await detectClient(shadow.querySelector('#host').value);
      shadow.querySelector('select#client').onchange({
        target: shadow.querySelector('select#client')
      });
      return false;
    }
  }, "Detect client"), VM.h("button", {
    onclick: async e => {
      e.preventDefault();
      shadow.querySelector('#res').innerText = (await testClient(shadow.querySelector('#host').value, shadow.querySelector('#username').value, shadow.querySelector('#password').value, shadow.querySelector('select#client').value)) ? 'Client seems to be working' : "Client doesn't seem to be working";
      return false;
    }
  }, "Test client"), VM.h("input", {
    type: "submit",
    value: "Save"
  }), VM.h("button", {
    onclick: e => panel.hide()
  }, "Close")), VM.h("p", {
    id: "res",
    style: "text-align: center;"
  })));
}
const Settings = () => {
  const panel = VM.getPanel({
    theme: 'dark',
    shadow: true,
    style: stylesheet
  });
  // give the panel access to itself :)
  panel.setContent(VM.h(SettingsElement, {
    panel: panel
  }));
  panel.setMovable(false);
  panel.wrapper.children[0].classList.add(styles.wrapper);
  let original_show = panel.show;
  panel.show = () => {
    original_show.apply(panel);
    document.body.style.overflow = 'hidden';
  };
  let original_hide = panel.hide;
  panel.hide = () => {
    original_hide.apply(panel);
    document.body.style.overflow = 'auto';
  };
  panel.show();
  profileSelectHandler({
    target: {
      value: profileManager.selectedProfile.id
    }
  }, panel.root);
};

function ExtendeSTCProfile({
  panel,
  profile,
  torrentUrl
}) {
  return VM.h("button", {
    style: "display: block; padding: 5px; margin: 5px; cursor: pointer;",
    onclick: e => {
      profile.addTorrent(torrentUrl);
      return panel.hide();
    }
  }, profile.name);
}
function ExtendedSTCElement({
  panel,
  torrentUrl
}) {
  let profiles = [];
  for (let profile of profileManager.profiles) {
    profiles.push(VM.h(ExtendeSTCProfile, {
      panel: panel,
      profile: profile,
      torrentUrl: torrentUrl
    }));
  }
  return VM.h("div", {
    style: "display: flex; flex-direction: column; align-items: center; justify-content:center;"
  }, "Choose which profile to send to", profiles, VM.h("button", {
    style: "display: block; padding: 5px; margin: 5px; background-color: #fe0000; cursor: pointer;",
    onclick: () => panel.hide()
  }, "Cancel"));
}
const ExtendedSTC = torrentUrl => {
  const panel = VM.getPanel({
    theme: 'dark',
    shadow: true,
    style: stylesheet
  });
  // give the panel access to itself :)
  panel.setContent(VM.h(ExtendedSTCElement, {
    panel: panel,
    torrentUrl: torrentUrl
  }));
  panel.setMovable(false);
  panel.wrapper.children[0].classList.add(styles.wrapper);
  let original_show = panel.show;
  panel.show = () => {
    original_show.apply(panel);
    document.body.style.overflow = 'hidden';
  };
  let original_hide = panel.hide;
  panel.hide = () => {
    original_hide.apply(panel);
    document.body.style.overflow = 'auto';
  };
  panel.show();
};
const XSTBTN = ({
  torrentUrl,
  freeleech
}) => {
  return VM.h("a", {
    title: "Add to client - extended!",
    href: "#",
    className: "sendtoclient",
    onclick: async e => {
      if (freeleech) if (!confirm('After sending to client a feeleech token will be consumed!')) return;
      ExtendedSTC(torrentUrl);
    }
  }, "X", freeleech ? "F" : "", "ST");
};
const STBTN = ({
  torrentUrl
}) => {
  return globalSettingsManager.button_type ? VM.h(XSTBTN, {
    freeleech: false,
    torrentUrl: torrentUrl
  }) : VM.h("a", {
    title: `Add to ${profileManager.selectedProfile.name}.`,
    href: "#",
    className: "sendtoclient",
    onclick: async e => {
      e.preventDefault();
      await profileManager.selectedProfile.addTorrent(torrentUrl);
      e.target.innerText = 'Added!';
      e.target.onclick = null;
    }
  }, "ST");
};
const FSTBTN = ({
  torrentUrl
}) => {
  return globalSettingsManager.button_type ? VM.h(XSTBTN, {
    freeleech: true,
    torrentUrl: torrentUrl
  }) : VM.h("a", {
    href: "#",
    title: `Freeleechize and add to ${profileManager.selectedProfile.name}.`,
    className: "sendtoclient",
    onclick: async e => {
      e.preventDefault();
      if (!confirm('Are you sure you want to use a freeleech token here?')) return;
      await profileManager.selectedProfile.addTorrent(torrentUrl);
      e.target.innerText = 'Added!';
      e.target.onclick = null;
    }
  }, "FST");
};
const handlers = [{
  name: 'Gazelle',
  matches: ["gazellegames.net","animebytes.tv","orpheus.network","passthepopcorn.me","greatposterwall.com","redacted.sh","jpopsuki.eu","tv-vault.me","sugoimusic.me","ianon.app","alpharatio.cc","uhdbits.org","morethantv.me","empornium.is","deepbassnine.com","broadcasthe.net","secret-cinema.pw"],
  run: async () => {
    for (const a of Array.from(document.querySelectorAll('a')).filter(a => a.innerText === 'DL' || a.title == 'Download Torrent')) {
      let parent = a.parentElement;
      let torrentUrl = a.href;
      let buttons = Array.from(parent.childNodes).filter(e => e.nodeName !== '#text');
      let fl = Array.from(parent.querySelectorAll('a')).find(a => a.innerText === 'FL');
      let fst = fl ? VM.h(VM.Fragment, null, "\xA0|\xA0", VM.h(FSTBTN, {
        torrentUrl: fl.href
      })) : null;
      parent.innerHTML = null;
      parent.appendChild(VM.m(VM.h(VM.Fragment, null, "[\xA0", buttons.map(e => VM.h(VM.Fragment, null, e, " | ")), VM.h(STBTN, {
        torrentUrl: torrentUrl
      }), fst, "\xA0]")));
    }
    window.addEventListener('profileChanged', () => {
      document.querySelectorAll('a.sendtoclient').forEach(e => {
        if (e.title.includes('Freeleechize')) {
          e.title = `Freeleechize and add to ${profileManager.selectedProfile.name}.`;
        } else {
          e.title = `Add to ${profileManager.selectedProfile.name}.`;
        }
      });
    });
  }
}, {
  name: 'BLU UNIT3D',
  matches: ["blutopia.cc","aither.cc"],
  run: async () => {
    let rid = await fetch(Array.from(document.querySelectorAll('ul>li>a')).find(e => e.innerText === 'My Profile').href + '/rsskey/edit').then(e => e.text()).then(e => e.replaceAll(/\s/g, '').match(/name="current_rsskey"readonlytype="text"value="(.*?)">/)[1]);
    handlers.find(h => h.name === 'UNIT3D').run(rid);
  }
}, {
  name: 'F3NIX',
  matches: ["beyond-hd.me"],
  run: async (rid = null) => {
    if (!rid) {
      rid = await fetch(location.origin + '/settings/change_rid').then(e => e.text()).then(e => e.match(/class="beta-form-main" name="null" value="(.*?)" disabled>/)[1]);
    }
    const appendButton = () => {
      Array.from(document.querySelectorAll('a[title="Download Torrent"]')).forEach(a => {
        let parent = a.parentElement;
        let torrentUrl = `${a.href.replace('/download/', '/torrent/download/')}.${rid}`;
        parent.appendChild(VM.m(VM.h(VM.Fragment, null, ' ', VM.h(STBTN, {
          torrentUrl: torrentUrl
        }))));
      });
    };
    appendButton();
    let oldPushState = unsafeWindow.history.pushState;
    unsafeWindow.history.pushState = function () {
      console.log('[SendToClient] Detected a soft navigation to ${unsafeWindow.location.href}');
      appendButton();
      return oldPushState.apply(this, arguments);
    };
  }
}, {
  name: 'UNIT3D',
  matches: ["desitorrents.tv","jptv.club","telly.wtf","torrentseeds.org"],
  run: async (rid = null) => {
    if (!rid) {
      rid = await fetch(Array.from(document.querySelectorAll('ul>li>a')).find(e => e.innerText.includes('My Profile')).href + '/settings/security').then(e => e.text()).then(e => e.match(/ current_rid">(.*?)</)[1]);
    }
    const appendButton = () => {
      Array.from(document.querySelectorAll('a[title="Download"]')).concat(Array.from(document.querySelectorAll('button[title="Download"], button[data-original-title="Download"]')).map(e => e.parentElement)).forEach(a => {
        let parent = a.parentElement;
        let torrentUrl = a.href.replace('/torrents/', '/torrent/') + `.${rid}`;
        parent.appendChild(VM.m(VM.h(STBTN, {
          torrentUrl: torrentUrl
        })));
      });
    };
    appendButton();
    console.log('[SendToClient] Bypassing CSP so we can listen for soft navigations.');
    document.addEventListener('popstate', () => {
      console.log('[SendToClient] Detected a soft navigation to ' + unsafeWindow.location.href);
      appendButton();
    });
    // listen for a CSP violation so that we can grab the nonces
    document.addEventListener('securitypolicyviolation', e => {
      const nonce = e.originalPolicy.match(/nonce-(.*?)'/)[1];
      let actualScript = VM.m(VM.h("script", {
        nonce: nonce
      }, `console.log('[SendToClient] Adding a navigation listener.');
            (() => {
              let oldPushState = history.pushState;
              history.pushState = function pushState() {
                  let ret = oldPushState.apply(this, arguments);
                  document.dispatchEvent(new Event('popstate'));
                  return ret;
              };
            })();`));
      document.head.appendChild(actualScript).remove();
    });
    // trigger a CSP violation
    document.head.appendChild(VM.m(VM.h("script", {
      nonce: "nonce-123"
    }, "window.csp = \"csp :(\";"))).remove();
  }
}, {
  name: 'Karagarga',
  matches: ["karagarga.in"],
  run: async () => {
    if (unsafeWindow.location.href.includes('details.php')) {
      let dl_btn = document.querySelector('a.index');
      let torrent_uri = dl_btn.href;
      return dl_btn.insertAdjacentElement('afterend', VM.m(VM.h("span", null, "\xA0 ", VM.h(STBTN, {
        torrentUrl: torrent_uri
      }))));
    }
    document.querySelectorAll("img[alt='Download']").forEach(e => {
      let parent = e.parentElement;
      let torrent_uri = e.parentElement.href;
      let container = parent.parentElement;
      let st = VM.m(VM.h(STBTN, {
        torrentUrl: torrent_uri
      }));
      container.appendChild(st);
    });
  }
}, {
  name: 'TorrentLeech',
  matches: ["torrentleech.org","www.torrentleech.org"],
  run: async () => {
    const username = document.querySelector('span.link').getAttribute('onclick').match('/profile/(.*?)/view')[1];
    let rid = await fetch(`/profile/${username}/edit`).then(e => e.text()).then(e => e.replaceAll(/\s/g, '').match(/rss.torrentleech.org\/(.*?)\</)[1]);
    document.head.appendChild(VM.m(VM.h("style", null, `td.td-quick-download { display: flex; }`)));
    for (const a of document.querySelectorAll('a.download')) {
      let torrent_uri = a.href.match(/\/download\/(\d*?)\/(.*?)$/);
      torrent_uri = `https://torrentleech.org/rss/download/${torrent_uri[1]}/${rid}/${torrent_uri[2]}`;
      a.parentElement.appendChild(VM.m(VM.h(STBTN, {
        torrentUrl: torrent_uri
      })));
    }
  }
}, {
  name: 'AnilistBytes',
  matches: ["anilist.co"],
  run: async () => {
    unsafeWindow._addTo = async torrentUrl => profileManager.selectedProfile.addTorrent(torrentUrl);
  }
}];
const createButtons = async () => {
  for (const handler of handlers) {
    const regex = handler.matches.join('|');
    if (unsafeWindow.location.href.match(regex)) {
      handler.run();
      console.log(`%c[SendToClient] Using engine {${handler.name}}`, 'color: #42adf5; font-weight: bold; font-size: 1.5em;');
      return handler.name;
    }
  }
};

GM.registerMenuCommand('Settings', () => {
  Settings();
});
const profileQuickSwitcher = () => {
  let id = GM.registerMenuCommand(`Selected Profile: ${profileManager.selectedProfile.name}`, () => {});
  window.addEventListener('profileChanged', () => {
    GM.unregisterMenuCommand(id);
    profileQuickSwitcher();
    window.removeEventListener('profileChanged', () => {});
  });
};
globalSettingsManager.load().then(() => profileManager.load().then(() => {
  profileQuickSwitcher();
  createButtons();
}));

})();
