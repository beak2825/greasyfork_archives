// ==UserScript==
// @name     Scenexe ignorer
// @namespace   scenexeignorer
// @description adds the /ignore playerID and /unignore playerID commands to scenexe.
// @author    discordtehe
// @license  MIT
// @version  1.0.1
// @grant    none
// @match     https://scenexe.io
// @match     https://test.scenexe.io
// @match     https://new-test.scenexe.io
// @match     https://test2.scenexe.io
// @require   https://greasyfork.org/scripts/457386-scenexeutils/code/ScenexeUtils.js?version=1133496
// @run-at   document-start
// @downloadURL https://update.greasyfork.org/scripts/457183/Scenexe%20ignorer.user.js
// @updateURL https://update.greasyfork.org/scripts/457183/Scenexe%20ignorer.meta.js
// ==/UserScript==

window.actionIgnore = function(action, playerID) {
    var data = JSON.parse(localStorage.getItem('ignored') || '{}');
    if (action == 'add') {
        data[playerID] = true;
        localStorage.setItem('ignored', JSON.stringify(data));
    } else if (action == 'remove') {
        delete data[playerID];
        localStorage.setItem('ignored', JSON.stringify(data));
    } else if (action == 'get') {
        return data;
    }
}

window.modifyEvents = function(events) {
    const newEvents = [];
    for (var i = 0; i < events.length; i++) {
      var type = events[i][0];
      var content = events[i][1];
      var ignored = actionIgnore('get');
      if (type == 1) {
          if (content.id in ignored)
              continue;
      } else if (type == 12) {
          if (content[0] in ignored)
              continue;
      }
      newEvents.push(events[i]);
    }
    return newEvents;
}

WebSocket.prototype.addEventListener = new Proxy(WebSocket.prototype.addEventListener, {
    apply: function (target, scope, args) {
        if (args[0] === 'message') {
            args[1] = new Proxy(args[1], {
                apply: function(ftarget, fscope, fargs) {
                    var decoded = decode(new Uint8Array(fargs[0].data));
                    if (decoded[0] == 0)
                        decoded[1][10] = modifyEvents(decoded[1][10]);
                    fargs[0] = new MessageEvent('message', {data: encode(decoded)})
                    let fdata = ftarget.apply(fscope, fargs);
                    return fdata;
                }
            })
        }
        let data = target.apply(scope, args);
        return data;
    }
})

WebSocket.prototype.send = new Proxy(WebSocket.prototype.send, {
    apply: function (target, scope, args) {
        var packet = decode(new Uint8Array(args[0]));
        if (packet[0] == 4 && typeof packet[1] == 'string') {
            var temp = packet[1].split(' ');
            if (temp.length > 1 && temp[0] == '/ignore')
                actionIgnore('add', temp[1]);
            else if (temp.length > 1 && temp[0] == '/unignore')
                actionIgnore('remove', temp[1]);
        }
        let data = target.apply(scope, args);
        return data;
    }
})