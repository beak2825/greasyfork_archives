// DEPRECATED: On Sep 26, 2020, this feature was added into TETR.IO PLUS (https://gitlab.com/UniQMG/tetrio-plus), and I will no longer keep this userscript up-to-date.


// ==UserScript==
// @name         TETR.IO Emote Helper
// @namespace    https://tampermonkey.net/
// @version      1.1
// @description  Allows you to press [TAB] to autocomplete emotes.
// @author       Jabster28
// @license      MIT
// @copyright    2020, Jabster28 (https://openuserjs.org/users/Jabster28)
// @require      https://gitcdn.xyz/cdn/nol13/fuzzball.js/21f0a68247185fafee0c9684ab0d6678c2049dd5/dist/fuzzball.umd.min.js
// @match        https://tetr.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/408920/TETRIO%20Emote%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/408920/TETRIO%20Emote%20Helper.meta.js
// ==/UserScript==

(async () => {
  var get = await fetch(`/api/users/${localStorage.userID}`, {
    headers: new Headers({
      Authorization: 'Bearer ' + localStorage.userToken
    })
  });
  var { user } = await get.json();
  var emotes = {
    base: {
      awesome: 'emotes/awesome.png',
      b1: 'emotes/b1.png',
      bigflush: 'emotes/bigflush.png',
      checked: 'emotes/checked.png',
      crossed: 'emotes/crossed.png',
      dogchoke: 'emotes/dogchoke.png',
      evil: 'emotes/evil.png',
      kagari: 'emotes/kagari.png',
      kagayes: 'emotes/kagayes.png',
      kagablush: 'emotes/kagablush.png',
      kagri: 'emotes/kagri.png',
      konata: 'emotes/konata.png',
      nicodab: 'emotes/nicodab.png',
      pog: 'emotes/pog.png',
      pausechamp: 'emotes/pausechamp.png',
      weirdchamp: 'emotes/weirdchamp.png',
      sadchamp: 'emotes/sadchamp.png',
      tetrio: 'emotes/tetrio.png',
      trelele: 'emotes/trelele.png',
      ultreme: 'emotes/ultreme.png',
      woomy: 'emotes/woomy.png',
      yui_eyes: 'emotes/yui_eyes.png',
      oyes: 'emotes/oyes.png',
      eee: 'emotes/eee.png',
      woke: 'emotes/woke.png',
      bin: 'emotes/bin.png',
      drboob: 'emotes/drboob.png',
      vno: 'emotes/vno.png',
      konacry: 'emotes/konacry.png',
      thonk: 'emotes/thonk.png',
      goodmorning: 'emotes/goodmorning.png',
      goodnight: 'emotes/goodnight.png',
      kagasing: 'emotes/kagasing.png',
      kagashock: 'emotes/kagashock.png',
      crying: 'emotes/crying.png',
      mikotommr: 'emotes/mikotommr.png',
      happy: 'emotes/happy.png',
      feisty: 'emotes/feisty.png',
      cacopog: 'emotes/cacopog.png',
      chaotic_cat: 'emotes/chaotic_cat.png',
      eyes: 'emotes/eyes.png',
      unranked: 'emotes/unranked.png',
      rankD: 'emotes/rankD.png',
      rankDplus: 'emotes/rankDplus.png',
      rankCminus: 'emotes/rankCminus.png',
      rankC: 'emotes/rankC.png',
      rankCplus: 'emotes/rankCplus.png',
      rankBminus: 'emotes/rankBminus.png',
      rankB: 'emotes/rankB.png',
      rankBplus: 'emotes/rankBplus.png',
      rankAminus: 'emotes/rankAminus.png',
      rankA: 'emotes/rankA.png',
      rankAplus: 'emotes/rankAplus.png',
      rankSminus: 'emotes/rankSminus.png',
      rankS: 'emotes/rankS.png',
      rankSplus: 'emotes/rankSplus.png',
      rankSS: 'emotes/rankSS.png',
      rankU: 'emotes/rankU.png',
      rankX: 'emotes/rankX.png',
      garpog: 'emotes/garpog.png',
      scott_pog: 'emotes/scott_pog.png',
      beastpog: 'emotes/beastpog.png',
      kagapog: 'emotes/kagapog.jpg',
      pogari: 'emotes/kagapog.jpg',
      kogori: 'emotes/kogori.png',
      goodkagari: 'emotes/goodkagari.png',
      kagablanket: 'emotes/goodkagari.png',
      ohyeah: 'emotes/ohyeah.png',
      alcapog: 'emotes/alcapog.png',
      link_pog: 'emotes/link_pog.png',
      cabpog: 'emotes/cabpog.png',
      caboozledpog: 'emotes/cabpog.png',
      caboozled_pog: 'emotes/cabpog.png',
      piece_z: 'emotes/piece_z.png',
      piece_l: 'emotes/piece_l.png',
      piece_o: 'emotes/piece_o.png',
      piece_s: 'emotes/piece_s.png',
      piece_i: 'emotes/piece_i.png',
      piece_j: 'emotes/piece_j.png',
      piece_t: 'emotes/piece_t.png',
      pasta: 'emotes/pasta.png',
      sad: 'emotes/sad.png',
      kagathink: 'emotes/kagathink.png',
      thinkagari: 'emotes/kagathink.png',
      notlikethis: 'emotes/notlikethis.png',
      random: 'emotes/random.png',
      starechamp: 'emotes/starechamp.png',
      bench: 'emotes/bench.png',
      lizzieboi: 'emotes/lizzieboi.gif'
    },
    supporter: {
      supporter: 'emotes/supporter.png',
      drake: 'emotes/drake.gif',
      kagaristep: 'emotes/kagaristep.gif',
      nyndance: 'emotes/nyndance.gif',
      pogchomp: 'emotes/pogchomp.gif',
      worthit: 'emotes/worthit.gif',
      laundrycat: 'emotes/laundrycat.gif',
      catbedoingthelaundry: 'emotes/laundrycat.gif',
      h: 'emotes/h.gif',
      gg: 'emotes/gg.png',
      ggs: 'emotes/ggs.png',
      glhf: 'emotes/glhf.png'
    },
    verified: {
      verified: 'emotes/verified.png'
    },
    staff: {
      gotcha: 'emotes/gotcha.png',
      kagahorny: 'emotes/kagahorny.png',
      mikotohorny: 'emotes/mikotohorny.png'
    }
  };
  let cycle = '';
  let cyclenum = 0;
  // @ts-ignore
  var emote;

  let emoteChecker = () => {
    emote = document.activeElement.nodeName == "INPUT" && document.activeElement.attributes.id.nodeValue.includes("chat") ? document.activeElement : null
	  if (!emote) return undefined;
    var text = emote.value.split(' ').pop();
    if (text && /^:\w*$/.exec(text)) return text;
    else return undefined;
  };
  emoteChecker();

  window.addEventListener('keydown', e => {
    if (e.key == 'Tab') {
      emote = document.activeElement.nodeName == "INPUT" ? document.activeElement : null
      var results, text;
      if (!cycle) {
        text = emoteChecker();
        if (text) {
          results = fuzzball.extract(text, [
            ...Object.keys(emotes.base),
            ...(user.supporter ? Object.keys(emotes.supporter) : []),
            ...(user.verified ? Object.keys(emotes.verified) : []),
            ...(user.role == 'admin' ? Object.keys(emotes.staff) : [])
          ]);
          if (results[0][1] < 50) return;
          var oldtext = emote.value.split(' ');
          oldtext.pop();
          emote.value = [...oldtext, ':' + results[0][0] + ':'].join(' ');
          cycle = text;
          cyclenum = 1;
        }
      } else {
        results = fuzzball.extract(cycle, [
          ...Object.keys(emotes.base),
          ...(user.supporter ? Object.keys(emotes.supporter) : []),
          ...(user.verified ? Object.keys(emotes.verified) : []),
          ...(user.role == 'admin' ? Object.keys(emotes.staff) : [])
        ]);
        if (results[cyclenum][1] < 50) {
          cyclenum = 0;
          text = emoteChecker();
          if (text) {
            results = fuzzball.extract(text, [
              ...Object.keys(emotes.base),
              ...(user.supporter ? Object.keys(emotes.supporter) : []),
              ...(user.verified ? Object.keys(emotes.verified) : []),
              ...(user.role == 'admin' ? Object.keys(emotes.staff) : [])
            ]);
            if (results[0][1] < 50) return;
            oldtext = emote.value.split(' ');
            oldtext.pop();
            emote.value = [...oldtext, ':' + results[0][0] + ':'].join(' ');
            cycle = text;
            cyclenum = 1;
          }
          return;
        }
        if (cyclenum >= results.length || cyclenum >= 10) cyclenum = 0;
        oldtext = emote.value.split(' ');
        oldtext.pop();
        emote.value = [...oldtext, ':' + results[cyclenum][0] + ':'].join(' ');
        cyclenum++;
      }
    } else {
      cycle = '';
      cyclenum = 0;
    }
  });
})()