// ==UserScript==
// @name         Auto HIT Catcher
// @namespace    https://www.mturkcrowd.com/members/aveline.7/
// @version      1.5.9
// @description  Probably does nothing.
// @author       aveline
// @icon         https://i.imgur.com/jsju8Wy.png
// @include      https://worker.mturk.com/*
// @connect      amazon.com
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @grant        GM_addValueChangeListener
// @downloadURL https://update.greasyfork.org/scripts/393363/Auto%20HIT%20Catcher.user.js
// @updateURL https://update.greasyfork.org/scripts/393363/Auto%20HIT%20Catcher.meta.js
// ==/UserScript==

function windowIsOnAutoCatcher() {
  if (window.location.href.includes('autohitcatcher')) {
    return true;
  }
}

/* --- Log Stuff --- */

var acceptLog = [];
var missLog = [];
var blockList = [];
var includeList = [];
var pandaCards = [];
var pandaList = [];
var toLog = [];
var tvLog = [];
var catchLog = [];
var qLog = [];

if (GM_getValue('blockList')) {
  blockList = JSON.parse(GM_getValue('blockList'));
} else {
  GM_setValue("blockList", JSON.stringify([]));
}

if (GM_getValue('includeList')) {
  includeList = JSON.parse(GM_getValue('includeList'));
} else {
  GM_setValue("includeList", JSON.stringify([]));
}

if (GM_getValue('pandaCards')) {
  pandaCards = JSON.parse(GM_getValue('pandaCards'));
} else {
  GM_setValue("pandaCards", JSON.stringify([]));
}

function searchLogs(gid) {
  var i = 0
  var hitLogged = false;
  for (i = 0; i < missLog.length; i++) {
    if (missLog[i].includes(gid) == true) {
      hitLogged = true;
    }
  }
  return hitLogged;
}

function searchBlocks(rid, gid, name, title, desc, pay) {
  var i = 0
  var hitBlocked = false;
  for (i = 0; i < blockList.length; i++) {
    if (
      blockList[i][1].toLowerCase().includes(rid.toLowerCase()) == true ||
      blockList[i][1].toLowerCase().includes(gid.toLowerCase()) == true ||
      name.toLowerCase().includes(blockList[i][1].toLowerCase()) == true ||
      title.toLowerCase().includes(blockList[i][1].toLowerCase()) == true ||
      desc.toLowerCase().includes(blockList[i][1].toLowerCase()) == true
    ) {
      if (blockList[i][2] === 'Yes') {
        hitBlocked = true;
      }
      else if (blockList[i][2] === 'No' && pay < blockList[i][3]) {
        hitBlocked = true;
      }
    }
  }
  return hitBlocked;
}

function searchTOLog(rid) {
  var toRating = null;
  var i = 0;
  for (i = 0; i < toLog.length; i++) {
    if (toLog[i][1].includes(rid) == true) {
      toRating = toLog[i][2];
    }
  }
  return toRating;
}

/*
function searchTVLog(rid) {
  var tvRating = null;
  var i = 0;
  for (i = 0; i < tvLog.length; i++) {
    if (tvLog[i][1].includes(rid) == true) {
      tvRating = tvLog[i][2];
    }
  }
  return tvRating;
}
*/
function searchTVLog(rid, pay, title) {
  var tvRating = null;
  for (var i = 0; i < tvLog.length; i++) {
    if (tvLog[i][1] === rid && tvLog[i][3] === pay && tvLog[i][4] === title) {
      tvRating = parseFloat(tvLog[i][2]);
    }
  }
  return tvRating;
}

function searchCatchLog(gid, logEntry) {
  var i = 0;
  for (i = 0; i < catchLog.length; i++) {
    if (catchLog[i][0].includes(gid) == true) {
      catchLog.splice(i, 1, logEntry);
      return true;
    }
  }
}

function appendCatchLog() {
  logs.innerHTML = '';
  var i = 0;
  for (i = 0; i < catchLog.length; i++) {
    logs.innerHTML += JSON.stringify(catchLog[i]).replace('[\"', '<br>').replace('\"]', '');
  }
}

var eTime = Math.floor((new Date).getTime()/1000);
function purgeLog() {
  var i = 0
  for (i = 0; i < missLog.length; i++) {
    if (eTime - missLog[i][0] > 30) {
      missLog.splice(i, 1);
      i--;
    }
  }
  for (i = 0; i < tvLog.length; i++) {
    if (eTime - tvLog[i][0] > 1800) {
      tvLog.splice(i, 1);
      i--;
    }
  }
  for (i = 0; i < toLog.length; i++) {
    if (eTime - toLog[i][0] > 3600) {
      toLog.splice(i, 1);
      i--;
    }
  }
}

/* --- Alert Stuff --- */

var available_voices = window.speechSynthesis.getVoices();
function textToSpeech(speech) {
  available_voices = window.speechSynthesis.getVoices();
  var voice = '';
  for (var i=0; i<available_voices.length; i++) {
    if (available_voices[i].lang === 'en-DE') {
      voice = available_voices[i];
      break;
    }
  }
  if (voice === '') {
    voice = available_voices[0];
  }

  var utter = new SpeechSynthesisUtterance();
  utter.rate = 0.95;
  utter.pitch = 1;
  utter.text = speech;
  utter.voice = voice;

  window.speechSynthesis.speak(utter);
}

var bell = new Audio("https://static1.grsites.com/archive/sounds/musical/musical002.wav");
//var chime = new Audio("https://www.meangirlsturk.com/snd/chime.wav");

function hitAlert(nameStuff) {
  if (GM_getValue('alert') == 'Voice') {
    textToSpeech(nameStuff);
  }
  else if (GM_getValue('alert') == 'Bell') {
    bell.play();
  }
  else if (GM_getValue('alert') == 'Chime') {
    //    chime.play();
  }
}

/* --- Watcher Stuff --- */

async function checkIncludes(rid, gid, name, title, desc, pay, hitsAvail) {
  var d = new Date();
  var hours = (d.getHours() % 12) ? (d.getHours() % 12) : 12;
  var minutes = d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes();
  var ampm = d.getHours() >= 12 ? ' PM' : ' AM';
  var time = hours + ":" + minutes + ampm;
  var i = 0
  var hitIncluded = false;
  try {
    for (i = 0; i < includeList.length; i++) {
      if (
        includeList[i][1].toLowerCase().includes(rid.toLowerCase()) == true ||
        includeList[i][1].toLowerCase().includes(gid.toLowerCase()) == true ||
        name.toLowerCase().includes(includeList[i][1].toLowerCase()) == true ||
        title.toLowerCase().includes(includeList[i][1].toLowerCase()) == true ||
        desc.toLowerCase().includes(includeList[i][1].toLowerCase()) == true
      ) {
        if (includeList[i][2] === 'Yes') {
          hitIncluded = true;
          if (includeList[i][5] !== 'No') {
            if (doesPandaExist(gid) !== true) {
              await addPandaFromInclude(name, gid, title, includeList[i][5], pay, includeList[i][8], includeList[i][7]);
              if (includeList[i][6] === 'Yes') {
                scanOff();
              }
              if (GM_getValue('alert') !== 'Off') {
                hitAlert('Panda added from include: ' + name);
              }
              let logEntry = ["<font color=lightgrey>" + time + " - Panda added from include: <a href='https://worker.mturk.com/projects/" +
                              gid + "/tasks' target='_blank'><font color=lightgrey>" + name + " - " + title +
                              "</font></a> - \$" + pay.toFixed(2) + "</font>"];
              await catchLog.push(logEntry);
              acceptLog.push(gid);
              appendCatchLog();
            }
          } else {
            await includeAccept(name, gid, title, pay);
          }
        } else if (includeList[i][2] === 'No' && pay >= includeList[i][3] && hitsAvail >= includeList[i][4]) {
          hitIncluded = true;
          if (includeList[i][5] !== 'No') {
            if (doesPandaExist(gid) !== true) {
              await addPandaFromInclude(name, gid, title, includeList[i][5], pay, includeList[i][8], includeList[i][7]);
              if (includeList[i][6] === 'Yes') {
                scanOff();
              }
              if (GM_getValue('alert') !== 'Off') {
                hitAlert('Panda added from include: ' + name);
              }
              let logEntry = ["<font color=lightgrey>" + time + " - Panda added from include: <a href='https://worker.mturk.com/projects/" +
                              gid + "/tasks' target='_blank'><font color=lightgrey>" + name + " - " + title +
                              "</font></a> - \$" + pay.toFixed(2) + "</font>"];
              await catchLog.push(logEntry);
              acceptLog.push(gid);
              appendCatchLog();
            }
          } else {
            await includeAccept(name, gid, title, pay);
          }
        }
        hitIncluded = true;
      }
    }
  } catch(e) {
    console.error(e);
  }
  return hitIncluded;
}

var toGood;
var hasTO;
async function toWatcher(reqid) {
  toGood = false;
  hasTO = false;
  let loggedRating = await searchTOLog(reqid);
  if (loggedRating !== undefined && loggedRating !== null) {
    hasTO = true;
    if (loggedRating >= minTO) {
      toGood = true;
    }
  } else {
    try {
      let response = await fetch('https://turkopticon.ucsd.edu/api/multi-attrs.php?ids=' + reqid);
      if (response.ok) {
        let toData = await response.json();
        if (toData[reqid].attrs != undefined) {
          hasTO = true;
          let toRating = parseFloat(toData[reqid].attrs.pay);
          toLog.push([eTime, rid, parseFloat(toData[reqid].attrs.pay)]);
          if (toRating >= minTO) {
            toGood = true;
          }
        }
      } else {
        console.log('TO Error: ' + await response.status);
      }
    } catch(e) {
      console.error(e);
    }
  }
}
/*
var tvGood;
var hasTV;
async function tvWatcher(reqid) {
  tvGood = false;
  hasTV = false;
  let loggedHourly = await searchTVLog(reqid);
  if (loggedHourly !== undefined && loggedHourly !== null) {
    hasTV = true;
    if (loggedHourly >= minTV) {
      tvGood = true;
    }
  } else {
    const headers = {
      'X-VIEW-KEY': '',
      'X-APP-KEY': 'I am a banana',
      'X-APP-VER': '0.1'
    }
    let response = await fetch('https://view.turkerview.com/v1/requesters/?requester_ids=' + reqid, { headers });
    if (response.ok) {
      let tvData = await response.json();
      if (tvData.requesters[reqid] != undefined) {
        if (tvData.requesters[reqid].wages.average.wage) {
          hasTV = true;
          let tvRating = parseFloat(tvData.requesters[reqid].wages.average.wage);
          tvLog.push([eTime, rid, parseFloat(tvData.requesters[reqid].wages.average.wage)]);
          if (tvRating >= minTV) {
            tvGood = true;
          }
        }
      }
    } else {
      console.log('TV Error: ' + await response.status);
    }
    return;
  }
}
*/

function getCurrent() {
  let d = new Date();
  let hours = (d.getHours() % 12) ? (d.getHours() % 12) : 12;
  let minutes = d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes();
  let seconds = ('0' + d.getSeconds()).slice(-2);
  let ampm = d.getHours() >= 12 ? ' PM' : ' AM';
  let time = hours + ":" + minutes + ":" + seconds + ampm;
  return time;
}

var tvGood;
var hasTV;
async function tvReqWatcher(reqid, pay, title) {
  console.log('Checking TV Req: ' + reqid + ' - ' + getCurrent());
  tvGood = false;
  hasTV = false;
  const headers = {
    'X-VIEW-KEY': '',
    'X-APP-KEY': 'I am a banana',
    'X-APP-VER': '0.1'
  }
  try {
    let response = await fetch('https://view.turkerview.com/v1/requesters/?requester_ids=' + reqid, { headers });
    if (response.ok) {
      let eTime = Math.floor((new Date).getTime()/1000);
      let tvData = await response.json();
      if (tvData.requesters[reqid] !== undefined) {
        if (tvData.requesters[reqid].wages.average.wage) {
          hasTV = true;
          let tvRating = parseFloat(tvData.requesters[reqid].wages.average.wage);
          tvLog.push([eTime, reqid, tvRating.toFixed(2), pay, title]);
          if (tvRating >= minTV) {
            tvGood = true;
          }
        } else {
          let tvRating = 0;
          tvLog.push([eTime, reqid, tvRating.toFixed(2), pay, title]);
        }
      } else {
        let tvRating = 0;
        tvLog.push([eTime, reqid, tvRating.toFixed(2), pay, title]);
      }
    } else {
      console.log('TV Error: ' + await response.status);
    }
  } catch(e) {
    console.error(e);
  }
}

async function tvWatcher(reqid, pay, title) {
  tvGood = false;
  hasTV = false;
  var loggedHourly = await searchTVLog(reqid, pay, title);
  if (loggedHourly !== undefined && loggedHourly !== null) {
    hasTV = true;
    if (loggedHourly > minTV) {
      tvGood = true;
    }
  } else {
    console.log('Checking TV HIT: ' + title + ' - ' + getCurrent());
    const postData = {
      requester_id: reqid,
      reward: pay,
      title: title
    };
    const headers = {
      'X-VIEW-KEY': '',
      'X-APP-KEY': 'I am a banana',
      'X-APP-VER': '0.1'
    }
    try {
      let response = await fetch('https://view.turkerview.com/v1/hits/hit/', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(postData)
      });
      if (response.ok) {
        let eTime = Math.floor((new Date).getTime()/1000);
        let tvData = await response.json();
        if (tvData.avg_hourly !== undefined && tvData.avg_hourly !== null) {
          hasTV = true;
          let tvRating = parseFloat(tvData.avg_hourly);
          tvLog.push([eTime, reqid, tvRating.toFixed(2), pay, title]);
          if (tvRating >= minTV) {
            tvGood = true;
          }
        } else {
          await tvReqWatcher(reqid, pay, title);
        }
      } else {
        console.log('TV Error: ' + await response.status);
      }
    } catch(e) {
      console.error(e);
    }
  }
}

var mturkData;
async function getMturkData() {
  try {
    await GM_xmlhttpRequest({
      method: "GET",
      url: 'https://worker.mturk.com/?page_size=' + GM_getValue('pageSize') +
      '&filters%5Bqualified%5D=true&filters%5Bmasters%5D=false&sort=updated_desc&filters%5Bmin_reward%5D=' +
      GM_getValue('minReward'),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      onload: async function(response) {
        if (response.status == 200) {
          if (response.finalUrl.startsWith('https://www.amazon.com/ap/signin?')) {
            scanOff();
            if (GM_getValue('alert') == 'Voice') {
              textToSpeech('Auto HIT Catcher has stopped. You are logged out of MTurk.');
            }
            alert('Auto HIT Catcher has stopped. You are logged out of MTurk.');
          } else {
            mturkData = JSON.parse(response.responseText);
            //console.log(mturkData);
          }
        } else if (response.status == 429) {
          mturkData = response.status;
          preNum++;
          pres.innerHTML = 'PREs: ' + preNum;
        } else {
          mturkData = null;
        }
      }
    });
  } catch(e) {
    console.error(e);
  }
}

async function acceptHIT(groupid) {
  var d = new Date();
  var hours = (d.getHours() % 12) ? (d.getHours() % 12) : 12;
  var minutes = d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes();
  var ampm = d.getHours() >= 12 ? ' PM' : ' AM';
  var time = hours + ":" + minutes + ampm;
  let t = Number(hitTimer);
  let h = ("0" + Math.floor(t / 3600)).slice(-2);
  let m = ("0" + Math.floor(t % 3600 / 60)).slice(-2);
  let s = ("0" + Math.floor(t % 3600 % 60)).slice(-2);
  let qTimer = h + ':' + m + ':' + s;
  try {
    let response = await fetch('https://worker.mturk.com/projects/' + groupid + '/tasks/accept_random?format=json');
    if (response.ok) {
      if (GM_getValue('alert') !== 'Off') {
        hitAlert('HIT Caught: ' + name);
      }
      let logEntry = ["<font color=#008B8B>" + time + " - HIT caught: <a href='https://worker.mturk.com/tasks' " +
                      "target='_blank'><font color=#008B8B>" + name + " - " + title + "</font></a> " +
                      "- \$" + hitPay.toFixed(2) + "</font>"];
      let qEntry =
          "<font color=lightgrey>" + qTimer + " - <a href='https://worker.mturk.com/" +
          "tasks' target='_blank'><font color=#008B8B>" + name + " - " + title +
          "</font></a> - \$" + hitPay.toFixed(2) + "</font><br>";
      qSection.style.display = 'block';
      qContent.innerHTML += qEntry;
      acceptLog.push(gid);
      if (await searchCatchLog(gid, logEntry) !== true) {
        await catchLog.push(logEntry);
      }
      appendCatchLog();
      getNum += hitPay;
      getTotal.innerHTML = "Total caught: $" + getNum.toFixed(2);
    } else if (response.status == 422) {
      let plinko = 'https://worker.mturk.com/ahcpanda?requester=' + name.replace(/[^a-z0-9 ()]+/gi, '') +
          '&gid=' + groupid + '&title=' + title.replace(/[^a-z0-9 ()]+/gi, '') + '&pay=' +
          hitPay.toFixed(2) + '&quantity=One';
      let plinkm = 'https://worker.mturk.com/ahcpanda?requester=' + name.replace(/[^a-z0-9 ()]+/gi, '') +
          '&gid=' + groupid + '&title=' + title.replace(/[^a-z0-9 ()]+/gi, '') + '&pay=' +
          hitPay.toFixed(2) + '&quantity=Many';
      let logEntry = ["<font color=lightgrey>" + time + " - HIT missed: <a href='https://worker.mturk.com/projects/" +
                      groupid + "/tasks' target='_blank'><font color=lightgrey>" + name + " - " + title + "</font></a> " +
                      "- \$" + hitPay.toFixed(2) + " [ <a href='" + plinko + "' title='Panda One' target='_blank'><font color=#008B8B>O</font></a> | " +
                      "<a href='" + plinkm + "' title='Panda Many' target='_blank'><font color=#008B8B>M</font></a> ]</font>"];
      missLog.push([eTime, gid]);
      if (await searchCatchLog(gid, logEntry) !== true) {
        await catchLog.push(logEntry);
      }
      appendCatchLog();
    } else if (response.status == 429) {
      missLog.push([eTime, gid]);
      preNum++;
      pres.innerHTML = 'PREs: ' + preNum;
    }
  } catch(e) {
    console.error(e);
  }
}

async function includeAccept(rname, groupid, hittitle, pay) {
  var d = new Date();
  var hours = (d.getHours() % 12) ? (d.getHours() % 12) : 12;
  var minutes = d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes();
  var ampm = d.getHours() >= 12 ? ' PM' : ' AM';
  var time = hours + ":" + minutes + ampm;
  let t = Number(hitTimer);
  let h = ("0" + Math.floor(t / 3600)).slice(-2);
  let m = ("0" + Math.floor(t % 3600 / 60)).slice(-2);
  let s = ("0" + Math.floor(t % 3600 % 60)).slice(-2);
  let qTimer = h + ':' + m + ':' + s;
  try {
    let response = await fetch('https://worker.mturk.com/projects/' + groupid + '/tasks/accept_random?format=json');
    if (response.ok) {
      if (GM_getValue('alert') !== 'Off') {
        hitAlert('Include List HIT Caught: ' + rname);
      }
      let logEntry = ["<font color=#008B8B>" + time + " - Include HIT caught: <a href='https://worker.mturk.com/tasks' " +
                      "target='_blank'><font color=#008B8B>" + rname + " - " + hittitle + "</font></a> " +
                      "- \$" + pay.toFixed(2) + "</font>"];
      let qEntry =
          "<font color=lightgrey>" + qTimer + " - <a href='https://worker.mturk.com/" +
          "tasks' target='_blank'><font color=#008B8B>" + rname + " - " + hittitle +
          "</font></a> - \$" + pay.toFixed(2) + "</font><br>";
      qSection.style.display = 'block';
      qContent.innerHTML += qEntry;
      acceptLog.push(groupid);
      if (await searchCatchLog(groupid, logEntry) !== true) {
        await catchLog.push(logEntry);
      }
      appendCatchLog();
      getNum += hitPay;
      getTotal.innerHTML = "Total caught: $" + getNum.toFixed(2);
    } else if (response.status == 422) {
      let plinko = 'https://worker.mturk.com/ahcpanda?requester=' + rname.replace(/[^a-z0-9 ()]+/gi, '') +
          '&gid=' + groupid + '&title=' + hittitle.replace(/[^a-z0-9 ()]+/gi, '') + '&pay=' +
          pay.toFixed(2) + '&quantity=One';
      let plinkm = 'https://worker.mturk.com/ahcpanda?requester=' + rname.replace(/[^a-z0-9 ()]+/gi, '') +
          '&gid=' + groupid + '&title=' + hittitle.replace(/[^a-z0-9 ()]+/gi, '') + '&pay=' +
          pay.toFixed(2) + '&quantity=Many';
      let logEntry = ["<font color=lightgrey>" + time + " - Include HIT missed: <a href='https://worker.mturk.com/projects/" +
                      groupid + "/tasks' target='_blank'><font color=lightgrey>" + rname + " - " + hittitle + "</font></a> " +
                      "- \$" + pay.toFixed(2) + " [ <a href='" + plinko + "' title='Panda One' target='_blank'><font color=#008B8B>O</font></a> | " +
                      "<a href='" + plinkm + "' title='Panda Many' target='_blank'><font color=#008B8B>M</font></a> ]</font>"];
      missLog.push([eTime, groupid]);
      if (await searchCatchLog(groupid, logEntry) !== true) {
        await catchLog.push(logEntry);
      }
      appendCatchLog();
    } else if (response.status == 429) {
      missLog.push([eTime, groupid]);
      preNum++;
      pres.innerHTML = 'PREs: ' + preNum;
    }
  } catch(e) {
    console.error(e);
  }
}

var name;
var rid;
var title;
var gid;
var desc;
var hitPay;
var hitsAvail;
var hitTimer;
async function runWatchers() {
  try {
    await getMturkData();
    if (mturkData !== 429 && mturkData !== undefined && mturkData !== null) {
      var i = 0;
      if (GM_getValue('incOnly') == 'Yes') {
        for (i = 0; i < Object.keys(mturkData.results).length; i++) {
          rid = await mturkData.results[i].requester_id;
          gid = await mturkData.results[i].hit_set_id;
          name = await mturkData.results[i].requester_name;
          title = await mturkData.results[i].title;
          desc = await mturkData.results[i].description;
          hitPay = await mturkData.results[i].monetary_reward.amount_in_dollars;
          hitsAvail = await mturkData.results[i].assignable_hits_count;
          hitTimer = await mturkData.results[i].assignment_duration_in_seconds;
          if (searchBlocks(rid, gid, name, title, desc, hitPay) == false && acceptLog.includes(gid) == false) {
            await checkIncludes(rid, gid, name, title, desc, hitPay, hitsAvail);
          }
        }
      } else {
        for (i = 0; i < Object.keys(mturkData.results).length; i++) {
          rid = await mturkData.results[i].requester_id;
          gid = await mturkData.results[i].hit_set_id;
          name = await mturkData.results[i].requester_name;
          title = await mturkData.results[i].title;
          desc = await mturkData.results[i].description;
          hitPay = await mturkData.results[i].monetary_reward.amount_in_dollars;
          hitsAvail = await mturkData.results[i].assignable_hits_count;
          if (
            searchBlocks(rid, gid, name, title, desc, hitPay) == false &&
            acceptLog.includes(gid) == false &&
            searchLogs(gid) == false
          ) {
            if (
              await checkIncludes(rid, gid, name, title, desc, hitPay, hitsAvail) == false &&
              hitPay >= minRated
            ) {
              if (await minTO > 1) {
                await toWatcher(rid);
              }
              if (await minTV > 1) {
                await tvWatcher(rid, hitPay, title);
              }
              if (await toGood == true || await tvGood == true) {
                await acceptHIT(gid);
              }
              if (hasTO == false && hasTV == false && hitPay >= minUnrated) {
                await acceptHIT(gid);
              }
            }
            else if (hitPay >= minUnrated) {
              if (await minTO > 1) {
                await toWatcher(rid);
              }
              if (await minTV > 1) {
                await tvWatcher(rid);
              }
              if (hasTO == false && hasTV == false) {
                await acceptHIT(gid);
              }
            }
          }
        }
      }
    }
  } catch(e) {
    console.error(e);
  }
}

/* --- Queue Stuff --- */

var queue;
async function getQueue() {
  try {
    await GM_xmlhttpRequest({
      method: "GET",
      url: 'https://worker.mturk.com/tasks?format=json',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      onload: async function(response) {
        if (response.status == 200) {
          queue = JSON.parse(response.responseText);
        } else if (response.status == 429) {
          preNum++;
          pres.innerHTML = 'PREs: ' + preNum;
        }
      }
    });
    setTimeout(async function() {
      await getQueueList();
    }, 1000);
  } catch(e) {
    console.error(e);
  }
}

function getQueueList() {
  if (queue !== 429 && queue !== undefined && Object.keys(queue.tasks).length > 0) {
    qLog = [];
    qSection.style.display = 'block';
    qContent.innerHTML = '';
    for (var i = 0; i < Object.keys(queue.tasks).length; i++) {
      let qGID = queue.tasks[i].project.hit_set_id;
      let qPay = queue.tasks[i].project.monetary_reward.amount_in_dollars;
      let qName = queue.tasks[i].project.requester_name;
      let qTitle = queue.tasks[i].project.title;
      let qURL = queue.tasks[i].task_url.replace('.json', '');
      let d = Number(queue.tasks[i].time_to_deadline_in_seconds);
      let h = ("0" + Math.floor(d / 3600)).slice(-2);
      let m = ("0" + Math.floor(d % 3600 / 60)).slice(-2);
      let s = ("0" + Math.floor(d % 3600 % 60)).slice(-2);
      let qTimer = h + ':' + m + ':' + s;
      let qEntry =
          "<font color=lightgrey>" + qTimer + " - <a href='https://worker.mturk.com" +
          qURL + "' target='_blank'><font color=#008B8B>" + qName + " - " + qTitle +
          "</font></a> - \$" + qPay.toFixed(2) + "</font><br>";
      qContent.innerHTML += qEntry;
      //GM_setValue('Queue ' + qGID, getQueueCount(qGID));
      qLog.push([qGID, getQueueCount(qGID)]);
    }
  } else {
    qSection.style.display = 'none';
    qContent.innerHTML = '';
  }
}

if (windowIsOnAutoCatcher()) {
  getQueue();

  setInterval(function() {
    getQueue();
  }, 10000);
}

function getQueueCount(groupid) {
  var count = 0;
  if (queue !== 429 && queue !== undefined) {
    for (var i = 0; i < Object.keys(queue.tasks).length; i++) {
      if (queue.tasks[i].project.hit_set_id == groupid) {
        count++;
      }
    }
  }
  return count;
}

function adjustQueueCount(groupid, count) {
  for (var i = 0; i < qLog.length; i++) {
    if (qLog[i][0] === groupid) {
      qLog[i][1] = count;
    }
  }
}

function findInQueue(groupid) {
  let queued = 0;
  for (var i = 0; i < qLog.length; i++) {
    if (qLog[i][0] === groupid) {
      queued = qLog[i][1];
    }
  }
  return queued;
}

function removeFromQueue(groupid) {
  for (var i = 0; i < qLog.length; i++) {
    if (qLog[i][0] === groupid) {
      qLog.splice(i, 1);
      i--;
    }
  }
}

function getAcceptCount(maxQueue, groupid) {
  var getMore = maxQueue - getQueueCount(groupid);
  return getMore;
}

/* --- Panda Stuff --- */

var runningPandas = [];

function doesPandaExist(groupid) {
  for (var i = 0; i < pandaCards.length; i++) {
    if (pandaCards[i][1].includes(groupid) == true) {
      return true;
    }
  }
}

function getPandaLogged(groupid) {
  for (var i = 0; i < runningPandas.length; i++) {
    if (runningPandas[i][1].includes(groupid) == true) {
      return true;
    }
  }
}

function getDisabledPandas() {
  for (var i = 0; i < runningPandas.length; i++) {
    let groupId = runningPandas[i][1];
    if (!GM_getValue('Collect ' + groupId) || GM_getValue('Collect ' + groupId) === 'collectOff') {
      runningPandas.splice(i, 1);
      i--;
    }
  }
}

async function getRunningPandas() {
  if (GM_getValue('pandaCards')) {
    pandaCards = JSON.parse(GM_getValue('pandaCards'));
  } else {
    pandaCards = [];
  }
  await getDisabledPandas();
  for (var i = 0; i < pandaCards.length; i++) {
    let pandaName = pandaCards[i][0];
    let groupId = pandaCards[i][1];
    let pQuantity = pandaCards[i][2];
    let sLimit = pandaCards[i][5];
    let maxQueue = pandaCards[i][6];
    if (GM_getValue('Collect ' + groupId) === 'collectOn' && getPandaLogged(groupId) !== true) {
      runningPandas.push([pandaName, groupId, pQuantity, sLimit, maxQueue]);
    }
  }
}

function pandaTimer(ms) {
  return new Promise(res => setTimeout(res, ms));
}

var searched;
var searchNum;
var caught;
var caughtNum;
async function runPandas() {
  for (var i = 0; i < runningPandas.length; i++) {
    getRunningPandas();
    let d = new Date();
    let hours = (d.getHours() % 12) ? (d.getHours() % 12) : 12;
    let minutes = d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes();
    let seconds = ('0' + d.getSeconds()).slice(-2);
    let ampm = d.getHours() >= 12 ? ' PM' : ' AM';
    let time = hours + ":" + minutes + ":" + seconds + ampm;
    let startPanda = Date.now();
    let pandaDelay;
    let pandaName = runningPandas[i][0];
    let groupId = runningPandas[i][1];
    let pQuantity = runningPandas[i][2];
    let sLimit = runningPandas[i][3];
    let maxQueue = runningPandas[i][4];
    //let queueCount = GM_getValue('Queue ' + groupId);
    let queueCount = findInQueue(groupId);
    if (document.getElementById(groupId + '_searched') && queueCount < maxQueue) {
      searched = document.getElementById(groupId + '_searched');
      searchNum = document.getElementById(groupId + '_searched').innerHTML.replace('Searched: ', '');
      caught = document.getElementById(groupId + '_caught');
      caughtNum = document.getElementById(groupId + '_caught').innerHTML.replace('Caught: ', '');
      searchNum++;
      searched.innerHTML = 'Searched: ' + searchNum;
      if (sLimit != 0 && searchNum >= sLimit) {
        selectedCollect = document.getElementById(groupId + '_collect');
        pCollectOff(groupId);
      }
      try {
        let response = await fetch('https://worker.mturk.com/projects/' + groupId + '/tasks/accept_random?format=json');
        if (response.ok) {
          caughtNum++;
          caught.innerHTML = 'Caught: ' + caughtNum;
          if (GM_getValue('alert') !== 'Off' && GM_getValue('Alert ' + groupId) === 'alertOn') {
            hitAlert('HIT Caught: ' + pandaName);
          }
          if (pQuantity === 'One') {
            selectedCollect = document.getElementById(groupId + '_collect');
            pCollectOff(groupId);
          }
          queueCount++;
          //GM_setValue('Queue ' + groupId, queueCount);
          await adjustQueueCount(groupId, queueCount);
        } else if (response.status == 429) {
          preNum++;
          pres.innerHTML = 'PREs: ' + preNum;
        }
        let loadTime = Date.now() - startPanda;
        pandaDelay = GM_getValue('scanFreq') - loadTime;
        await pandaTimer(pandaDelay);
      } catch(e) {
        console.error(e);
      }
    } else {
      return;
    }
  }
}

async function watchForPandas() {
  if (GM_getValue("run") === "off") {
    var pandaRate;
    await getRunningPandas();
    if (runningPandas == []) {
      pandaRate = GM_getValue('scanFreq');
    } else {
      pandaRate = 0;
    }
    await runPandas();
    setTimeout(async function() {
      await watchForPandas();
    },pandaRate);
  }
}
watchForPandas();

function windowIsOnHIT() {
  if (window.location.href.includes('/projects/')) {
    return true;
  }
}

function windowIsOnRequesterSearch() {
  if (window.location.href.includes('/requesters/')) {
    return true;
  }
}

function windowIsOnSearchPage() {
  var page = document.getElementsByTagName("body")[0];
  if (page.innerHTML.indexOf('HIT Groups') != -1) {
    return true;
  }
}

if (windowIsOnHIT()) {
  setTimeout(function() {
    let rName = document.querySelector("body > div.m-b-md > div.container-fluid.project-detail-bar > div > div.col-sm-12.col-md-7.text-xs-right > div > div.col-xs-3.col-xl-4.text-truncate.text-sm-left.text-md-right > span.detail-bar-value > a").title;
    let gid = window.location.href.split('projects/')[1].split('/tasks')[0];
    let hitTitle = document.querySelector("body > div.m-b-md > div.container-fluid.project-detail-bar > div > div.col-sm-12.col-md-5 > div > div > div > div.text-truncate").title;
    let hitPay = document.querySelector("body > div.m-b-md > div.container-fluid.project-detail-bar > div > div.col-sm-12.col-md-7.text-xs-right > div > div.col-xs-2.col-sm-3.col-xl-2 > span.detail-bar-value").textContent.replace('\$', '').trim();

    var mturkButtons = document.querySelector('body > div.m-b-md > div.text-xs-right > nav > div > ' +
                                              'div:nth-child(1) > div > div.work-pipeline-action');

    var pandaBut = document.createElement('span');
    mturkButtons.insertBefore(pandaBut, mturkButtons.firstChild);
    pandaBut.style.padding = '10px 0px 0px 0px';

    var pOBut = document.createElement('span');
    pOBut.className = 'btn btn-secondary panda-one';
    pOBut.type = 'button';
    pOBut.id = "pOBtn";
    pOBut.title = 'Panda one';
    pandaBut.appendChild(pOBut);
    pOBut.innerHTML = "<i class='fa fa-angle-right'></i>";
    pOBut.style.lineHeight = '1.8rem';
    pOBut.style.textAlign = 'center';
    pOBut.style.fontWeight = 'bold';
    pOBut.style.height ="28px";
    pOBut.style.width ="24px";
    pOBut.style.border = "1px solid #6D59B4";
    pOBut.style.borderRadius = "1px";
    pOBut.style.fontSize = "24px";
    pOBut.style.padding = "0px 3px 0px 8px";
    pOBut.style.margin = "0px 3px 0px 14px";
    pOBut.style.display = "inline-block";
    pOBut.style.color = "#6D59B4";

    var pMBut = document.createElement('span');
    pMBut.className = 'btn btn-secondary panda-many';
    pMBut.type = 'button';
    pMBut.id = "pOBtn";
    pMBut.title = 'Panda many';
    pandaBut.appendChild(pMBut);
    pMBut.innerHTML = "<i class='fa fa-angle-double-right'></i>";
    pMBut.style.lineHeight = '1.8rem';
    pMBut.style.textAlign = 'center';
    pMBut.style.fontWeight = 'bold';
    pMBut.style.height ="28px";
    pMBut.style.width ="24px";
    pMBut.style.border = "1px solid #6D59B4";
    pMBut.style.borderRadius = "1px";
    pMBut.style.fontSize = "24px";
    pMBut.style.padding = "0px 4px 0px 5px";
    pMBut.style.margin = "0px 14px 0px 3px";
    pMBut.style.display = "inline-block";
    pMBut.style.color = "#6D59B4";

    var sendData = [];

    pOBut.onclick = function() {
      sendData = [rName, gid, hitTitle, 'One', hitPay, 0];
      GM_setValue('sendPanda', JSON.stringify(sendData));
    }

    pMBut.onclick = function() {
      sendData = [rName, gid, hitTitle, 'Many', hitPay, 0];
      GM_setValue('sendPanda', JSON.stringify(sendData));
    }
  }, 500);
}

if (windowIsOnRequesterSearch()) {
  let hitRows = document.querySelectorAll("#MainContent > div:nth-child(8) > div > div > ol > li > div.desktop-row.hidden-sm-down");

  setTimeout(function() {
    for (var i = 0; i < hitRows.length; i++) {
      let rName = document.querySelectorAll("#MainContent > div:nth-child(8) > div > div > ol > li > div.desktop-row.hidden-sm-down > span.p-x-sm.column.text-truncate.requester-column > span > a.show-visited")[i].textContent;
      let gid = document.querySelectorAll("#MainContent > div:nth-child(8) > div > div > ol > li > div.desktop-row.hidden-sm-down > span.p-x-sm.column.actions-column.text-xs-center > span > span > a.btn.work-btn.hidden-sm-down")[i].href.split('projects/')[1].split('/tasks')[0];
      let hitTitle = document.querySelectorAll("#MainContent > div:nth-child(8) > div > div > ol > li > div.desktop-row.hidden-sm-down > span.p-x-sm.column.text-truncate.project-name-column.hidden-sm-down")[i].title;
      let hitPay = document.querySelectorAll("#MainContent > div:nth-child(8) > div > div > ol > li > div.desktop-row.hidden-sm-down > span.p-x-sm.column.reward-column.hidden-sm-down.text-xs-right")[i].textContent.replace('\$', '').trim();

      var mturkButtons = document.querySelectorAll("#MainContent > div:nth-child(8) > div > div > ol > li > div.desktop-row.hidden-sm-down > span.p-x-sm.column.text-truncate.project-name-column.hidden-sm-down")[i];

      var pandaBut = document.createElement('span');
      mturkButtons.insertBefore(pandaBut, mturkButtons.firstChild);

      var pOBut = document.createElement('span');
      pOBut.className = 'btn btn-secondary panda-one';
      pOBut.type = 'button';
      pOBut.id = "pOBtn";
      pOBut.title = 'Panda one';
      pandaBut.appendChild(pOBut);
      pOBut.innerHTML = "<i class='fa fa-angle-right'></i>";
      pOBut.style.lineHeight = '1.3rem';
      pOBut.style.textAlign = 'center';
      pOBut.style.fontWeight = 'bold';
      pOBut.style.height ="20px";
      pOBut.style.width ="17px";
      pOBut.style.border = "1px solid #6D59B4";
      pOBut.style.borderRadius = "1px";
      pOBut.style.fontSize = "18px";
      pOBut.style.padding = "0px 1px 0px 5px";
      pOBut.style.margin = "0px 2px 0px 14px";
      pOBut.style.display = "inline-block";
      pOBut.style.color = "#6D59B4";

      var pMBut = document.createElement('span');
      pMBut.className = 'btn btn-secondary panda-many';
      pMBut.type = 'button';
      pMBut.id = "pOBtn";
      pMBut.title = 'Panda many';
      pandaBut.appendChild(pMBut);
      pMBut.innerHTML = "<i class='fa fa-angle-double-right'></i>";
      pMBut.style.lineHeight = '1.3rem';
      pMBut.style.textAlign = 'center';
      pMBut.style.fontWeight = 'bold';
      pMBut.style.height ="20px";
      pMBut.style.width ="17px";
      pMBut.style.border = "1px solid #6D59B4";
      pMBut.style.borderRadius = "1px";
      pMBut.style.fontSize = "18px";
      pMBut.style.padding = "0px 1px 0px 3px";
      pMBut.style.margin = "0px 8px 0px 2px";
      pMBut.style.display = "inline-block";
      pMBut.style.color = "#6D59B4";

      var sendData = [];

      pOBut.onclick = function(event) {
        event.stopImmediatePropagation();
        sendData = [rName, gid, hitTitle, 'One', hitPay, 0];
        GM_setValue('sendPanda', JSON.stringify(sendData));
      }

      pMBut.onclick = function(event) {
        event.stopImmediatePropagation();
        sendData = [rName, gid, hitTitle, 'Many', hitPay, 0];
        GM_setValue('sendPanda', JSON.stringify(sendData));
      }
    }
  }, 800)
}

if (windowIsOnSearchPage() && !windowIsOnRequesterSearch()) {
  let hitRows = document.querySelectorAll("#MainContent > div:nth-child(5) > div > div > ol > li > div.desktop-row.hidden-sm-down");

  setTimeout(function() {
    for (var i = 0; i < hitRows.length; i++) {
      let rName = document.querySelectorAll("#MainContent > div:nth-child(5) > div > div > ol > li > div.desktop-row.hidden-sm-down > span.p-x-sm.column.text-truncate.requester-column > span > a.show-visited")[i].textContent;
      let gid = document.querySelectorAll("#MainContent > div:nth-child(5) > div > div > ol > li > div.desktop-row.hidden-sm-down > span.p-x-sm.column.actions-column.text-xs-center > span > span > div > a")[i].href.split('projects/')[1].split('/tasks')[0];
      let hitTitle = document.querySelectorAll("#MainContent > div:nth-child(5) > div > div > ol > li > div.desktop-row.hidden-sm-down > span.p-x-sm.column.text-truncate.project-name-column.hidden-sm-down")[i].title;
      let hitPay = document.querySelectorAll("#MainContent > div:nth-child(5) > div > div > ol > li > div.desktop-row.hidden-sm-down > span.p-x-sm.column.reward-column.hidden-sm-down.text-xs-right")[i].textContent.replace('\$', '').trim();

      var mturkButtons = document.querySelectorAll("#MainContent > div:nth-child(5) > div > div > ol > li > div.desktop-row.hidden-sm-down > span.p-x-sm.column.text-truncate.project-name-column.hidden-sm-down")[i];

      var pandaBut = document.createElement('span');
      mturkButtons.insertBefore(pandaBut, mturkButtons.firstChild);

      var pOBut = document.createElement('span');
      pOBut.className = 'btn btn-secondary panda-one';
      pOBut.type = 'button';
      pOBut.id = "pOBtn";
      pOBut.title = 'Panda one';
      pandaBut.appendChild(pOBut);
      pOBut.innerHTML = "<i class='fa fa-angle-right'></i>";
      pOBut.style.lineHeight = '1.3rem';
      pOBut.style.textAlign = 'center';
      pOBut.style.fontWeight = 'bold';
      pOBut.style.height ="20px";
      pOBut.style.width ="17px";
      pOBut.style.border = "1px solid #6D59B4";
      pOBut.style.borderRadius = "1px";
      pOBut.style.fontSize = "18px";
      pOBut.style.padding = "0px 1px 0px 5px";
      pOBut.style.margin = "0px 2px 0px 14px";
      pOBut.style.display = "inline-block";
      pOBut.style.color = "#6D59B4";

      var pMBut = document.createElement('span');
      pMBut.className = 'btn btn-secondary panda-many';
      pMBut.type = 'button';
      pMBut.id = "pOBtn";
      pMBut.title = 'Panda many';
      pandaBut.appendChild(pMBut);
      pMBut.innerHTML = "<i class='fa fa-angle-double-right'></i>";
      pMBut.style.lineHeight = '1.3rem';
      pMBut.style.textAlign = 'center';
      pMBut.style.fontWeight = 'bold';
      pMBut.style.height ="20px";
      pMBut.style.width ="17px";
      pMBut.style.border = "1px solid #6D59B4";
      pMBut.style.borderRadius = "1px";
      pMBut.style.fontSize = "18px";
      pMBut.style.padding = "0px 1px 0px 3px";
      pMBut.style.margin = "0px 8px 0px 2px";
      pMBut.style.display = "inline-block";
      pMBut.style.color = "#6D59B4";

      var sendData = [];

      pOBut.onclick = function(event) {
        event.stopImmediatePropagation();
        sendData = [rName, gid, hitTitle, 'One', hitPay, 0];
        GM_setValue('sendPanda', JSON.stringify(sendData));
      }

      pMBut.onclick = function(event) {
        event.stopImmediatePropagation();
        sendData = [rName, gid, hitTitle, 'Many', hitPay, 0];
        GM_setValue('sendPanda', JSON.stringify(sendData));
      }
    }
  }, 800)
}


/* --- Interface Stuff --- */

/* Sets dropdown menus to their saved values */

function getMenuDefault(menu, value) {
  var i = 0;
  for (i = 0; i < menu.length; i++) {
    if (menu.options[i].value === value) {
      menu.options[i].selected = 'selected';
    }
  }
}

/* Page Setup */

if (window.location.toString().includes("https://worker.mturk.com/autohitcatcher")){
  document.title = "Auto HIT Catcher";
  var body = document.getElementsByTagName("body")[0];
  body.innerHTML = "";
  body.style.height = "100%";
  body.style.backgroundColor = '#181818';
  body.style.maxWidth = "800px";
  body.style.margin = "auto";
  body.style.fontFamily = "arial, helvetica, sans-serif";
  body.style.textShadow = "-1px -1px 0 rgba(0,0,0,0.3)";
  body.style.fontWeight = "bold";
  body.style.color = "lightgrey";
  var headline = document.createElement("h1");
  //headline.innerHTML = "Auto HIT Catcher";
  headline.style.color = '#008B8B'
  headline.style.fontSize = '48'
  headline.style.fontWeight = 'bold';
  headline.style.textAlign = 'center'
  headline.style.textDecoration = "none";
  headline.style.marginBottom = "10px";
  var pageTable = document.createElement("table");
  document.getElementsByTagName('body')[0].appendChild(pageTable);
  document.getElementsByTagName('table')[0].appendChild(headline);
  document.getElementsByTagName('table')[0].style.height = "100%";
  document.getElementsByTagName('table')[0].style.width = "100%";

  /* Option Labels */

  var labels = document.createElement('div');
  document.getElementsByTagName('table')[0].appendChild(labels);
  labels.style.textAlign = 'center'
  labels.style.marginBottom = "0px";

  var scanFreqLabel = document.createElement('span');
  document.getElementsByTagName('table')[0].appendChild(scanFreqLabel);
  scanFreqLabel.innerHTML = "Scan/Panda Rate";
  scanFreqLabel.style.display = "inline-block";
  scanFreqLabel.style.width ="150px";
  scanFreqLabel.style.margin = '18px 3px 0px 3px';
  labels.appendChild(scanFreqLabel);

  var minRatedLabel = document.createElement('span');
  document.getElementsByTagName('table')[0].appendChild(minRatedLabel);
  minRatedLabel.innerHTML = "Min Rated Pay";
  minRatedLabel.style.display = "inline-block";
  minRatedLabel.style.width ="150px";
  minRatedLabel.style.margin = '18px 3px 0px 3px';
  labels.appendChild(minRatedLabel);

  var minUnratedLabel = document.createElement('span');
  document.getElementsByTagName('table')[0].appendChild(minUnratedLabel);
  minUnratedLabel.innerHTML = "Min Unrated Pay";
  minUnratedLabel.style.display = "inline-block";
  minUnratedLabel.style.width ="150px";
  minUnratedLabel.style.margin = '18px 3px 0px 3px';
  labels.appendChild(minUnratedLabel);

  var minTOLabel = document.createElement('span');
  document.getElementsByTagName('table')[0].appendChild(minTOLabel);
  minTOLabel.innerHTML = "Min TO Rating";
  minTOLabel.style.display = "inline-block";
  minTOLabel.style.width ="150px";
  minTOLabel.style.margin = '18px 3px 0px 3px';
  labels.appendChild(minTOLabel);

  var minTVLabel = document.createElement('span');
  document.getElementsByTagName('table')[0].appendChild(minTVLabel);
  minTVLabel.innerHTML = "Min TV Hourly";
  minTVLabel.style.display = "inline-block";
  minTVLabel.style.width ="150px";
  minTVLabel.style.margin = '18px 3px 0px 3px';
  labels.appendChild(minTVLabel);

  /* Option Menus */

  var menus = document.createElement('div');
  document.getElementsByTagName('table')[0].appendChild(menus);

  var scanFreqMenu = document.createElement("select");
  scanFreqMenu.title = 'Rate at which the auto catcher will attempt to scan the search page. ' +
    '\nThe rate may not always be exact if several HITs are having to be ' +
    '\nchecked at once';
  scanFreqMenu.style.width ="150px";
  scanFreqMenu.style.margin = "5px";
  scanFreqMenu.style.border = "1px solid #544293";
  scanFreqMenu.style.borderRadius = "3px";
  scanFreqMenu.style.padding = "5px 10px 5px 10px";
  scanFreqMenu.style.display = "inline-block";
  scanFreqMenu.style.color = "#FFFFFF";
  scanFreqMenu.style.backgroundColor = "#6D59B4";
  scanFreqMenu.style.backgroundImage = "-webkit-linear-gradient(top, #6D59B4, #48358C)";
  menus.appendChild(scanFreqMenu);
  var scanChoice080 = document.createElement("option");
  scanChoice080.value = '800';
  scanChoice080.text = "0.8 Seconds";
  scanChoice080.style.fontWeight = "bold";
  scanFreqMenu.add(scanChoice080);
  var scanChoice090 = document.createElement("option");
  scanChoice090.value = '900';
  scanChoice090.text = "0.9 Seconds";
  scanChoice090.style.fontWeight = "bold";
  scanFreqMenu.add(scanChoice090);
  var scanChoice100 = document.createElement("option");
  scanChoice100.value = '1000';
  scanChoice100.text = "1 Seconds";
  scanChoice100.style.fontWeight = "bold";
  scanFreqMenu.add(scanChoice100);
  var scanChoice125 = document.createElement("option");
  scanChoice125.value = '1250';
  scanChoice125.text = "1.25 Seconds";
  scanChoice125.style.fontWeight = "bold";
  scanFreqMenu.add(scanChoice125);
  var scanChoice150 = document.createElement("option");
  scanChoice150.value = '1500';
  scanChoice150.text = "1.5 Seconds";
  scanChoice150.style.fontWeight = "bold";
  scanFreqMenu.add(scanChoice150);
  var scanChoice175 = document.createElement("option");
  scanChoice175.value = '1750';
  scanChoice175.text = "1.75 Seconds";
  scanChoice175.style.fontWeight = "bold";
  scanFreqMenu.add(scanChoice175);
  var scanChoice200 = document.createElement("option");
  scanChoice200.value = '2000';
  scanChoice200.text = "2 Seconds";
  scanChoice200.style.fontWeight = "bold";
  scanFreqMenu.add(scanChoice200);
  var scanChoice250 = document.createElement("option");
  scanChoice250.value = '2500';
  scanChoice250.text = "2.5 Seconds";
  scanChoice250.style.fontWeight = "bold";
  scanFreqMenu.add(scanChoice250);
  var scanChoice300 = document.createElement("option");
  scanChoice300.value = '3000';
  scanChoice300.text = "3 Seconds";
  scanChoice300.style.fontWeight = "bold";
  scanFreqMenu.add(scanChoice300);
  var scanChoice350 = document.createElement("option");
  scanChoice350.value = '3500';
  scanChoice350.text = "3.5 Seconds";
  scanChoice350.style.fontWeight = "bold";
  scanFreqMenu.add(scanChoice350);
  var scanChoice400 = document.createElement("option");
  scanChoice400.value = '4000';
  scanChoice400.text = "4 Seconds";
  scanChoice400.style.fontWeight = "bold";
  scanFreqMenu.add(scanChoice400);
  scanFreqMenu.addEventListener(
    'change',
    function() {
      var scanFreq = scanFreqMenu.value;
      GM_setValue('scanFreq',scanFreq);},
    false
  );
  if (GM_getValue('scanFreq')) {
    getMenuDefault(scanFreqMenu, GM_getValue('scanFreq'));
  } else {
    scanFreqMenu.options[2].selected = 'selected';
    GM_setValue('scanFreq', '1000');
  }

  var minRatedMenu = document.createElement("select");
  minRatedMenu.title = 'Minimum pay for HITs that have been reviewed on Turkopticon or TurkerView';
  minRatedMenu.style.width ="150px";
  minRatedMenu.style.margin = "5px";
  minRatedMenu.style.border = "1px solid #544293";
  minRatedMenu.style.borderRadius = "3px";
  minRatedMenu.style.padding = "5px 10px 5px 10px";
  minRatedMenu.style.display = "inline-block";
  minRatedMenu.style.color = "#FFFFFF";
  minRatedMenu.style.backgroundColor = "#6D59B4";
  minRatedMenu.style.backgroundImage = "-webkit-linear-gradient(top, #6D59B4, #48358C)";
  menus.appendChild(minRatedMenu);
  var payChoice010 = document.createElement("option");
  payChoice010.value = '0.10';
  payChoice010.text = "$0.10";
  payChoice010.style.fontWeight = "bold";
  minRatedMenu.add(payChoice010);
  var payChoice025 = document.createElement("option");
  payChoice025.value = '0.25';
  payChoice025.text = "$0.25";
  payChoice025.style.fontWeight = "bold";
  minRatedMenu.add(payChoice025);
  var payChoice050 = document.createElement("option");
  payChoice050.value = '0.50';
  payChoice050.text = "$0.50";
  payChoice050.style.fontWeight = "bold";
  minRatedMenu.add(payChoice050);
  var payChoice075 = document.createElement("option");
  payChoice075.value = '0.75';
  payChoice075.text = "$0.75";
  payChoice075.style.fontWeight = "bold";
  minRatedMenu.add(payChoice075);
  var payChoice100 = document.createElement("option");
  payChoice100.value = '1.00';
  payChoice100.text = "$1.00";
  payChoice100.style.fontWeight = "bold";
  minRatedMenu.add(payChoice100);
  var payChoice150 = document.createElement("option");
  payChoice150.value = '1.50';
  payChoice150.text = "$1.50";
  payChoice150.style.fontWeight = "bold";
  minRatedMenu.add(payChoice150);
  var payChoice200 = document.createElement("option");
  payChoice200.value = '2.00';
  payChoice200.text = "$2.00";
  payChoice200.style.fontWeight = "bold";
  minRatedMenu.add(payChoice200);
  var payChoice300 = document.createElement("option");
  payChoice300.value = '3.00';
  payChoice300.text = "$3.00";
  payChoice300.style.fontWeight = "bold";
  minRatedMenu.add(payChoice300);
  var payChoice400 = document.createElement("option");
  payChoice400.value = '4.00';
  payChoice400.text = "$4.00";
  payChoice400.style.fontWeight = "bold";
  minRatedMenu.add(payChoice400);
  var payChoice500 = document.createElement("option");
  payChoice500.value = '5.00';
  payChoice500.text = "$5.00";
  payChoice500.style.fontWeight = "bold";
  minRatedMenu.add(payChoice500);
  var payChoice1000 = document.createElement("option");
  payChoice1000.value = '10.00';
  payChoice1000.text = "$10.00";
  payChoice1000.style.fontWeight = "bold";
  minRatedMenu.add(payChoice1000);
  minRatedMenu.addEventListener(
    'change',
    function() {
      var minRated = minRatedMenu.value;
      GM_setValue('minRated',minRated);},
    false
  );
  if (GM_getValue('minRated')) {
    getMenuDefault(minRatedMenu, GM_getValue('minRated'));
  } else {
    minRatedMenu.options[1].selected = 'selected';
    GM_setValue('minRated', '0.25');
  }

  var displayUR;
  var minUnratedMenu = document.createElement("select");
  minUnratedMenu.title = 'Minimum pay for HITs that have no reviews on Turkopticon or TurkerView';
  minUnratedMenu.style.width ="150px";
  minUnratedMenu.style.margin = "5px";
  minUnratedMenu.style.border = "1px solid #544293";
  minUnratedMenu.style.borderRadius = "3px";
  minUnratedMenu.style.padding = "5px 10px 5px 10px";
  minUnratedMenu.style.display = "inline-block";
  minUnratedMenu.style.color = "#FFFFFF";
  minUnratedMenu.style.backgroundColor = "#6D59B4";
  minUnratedMenu.style.backgroundImage = "-webkit-linear-gradient(top, #6D59B4, #48358C)";
  menus.appendChild(minUnratedMenu);
  var urChoiceOff = document.createElement("option");
  urChoiceOff.value = '999.00';
  urChoiceOff.text = "Off";
  urChoiceOff.style.fontWeight = "bold";
  minUnratedMenu.add(urChoiceOff);
  var urChoice025 = document.createElement("option");
  urChoice025.value = '0.25';
  urChoice025.text = "$0.25";
  urChoice025.style.fontWeight = "bold";
  minUnratedMenu.add(urChoice025);
  var urChoice050 = document.createElement("option");
  urChoice050.value = '0.50';
  urChoice050.text = "$0.50";
  urChoice050.style.fontWeight = "bold";
  minUnratedMenu.add(urChoice050);
  var urChoice075 = document.createElement("option");
  urChoice075.value = '0.75';
  urChoice075.text = "$0.75";
  urChoice075.style.fontWeight = "bold";
  minUnratedMenu.add(urChoice075);
  var urChoice100 = document.createElement("option");
  urChoice100.value = '1.00';
  urChoice100.text = "$1.00";
  urChoice100.style.fontWeight = "bold";
  minUnratedMenu.add(urChoice100);
  var urChoice200 = document.createElement("option");
  urChoice200.value = '2.00';
  urChoice200.text = "$2.00";
  urChoice200.style.fontWeight = "bold";
  minUnratedMenu.add(urChoice200);
  var urChoice300 = document.createElement("option");
  urChoice300.value = '3.00';
  urChoice300.text = "$3.00";
  urChoice300.style.fontWeight = "bold";
  minUnratedMenu.add(urChoice300);
  var urChoice400 = document.createElement("option");
  urChoice400.value = '4.00';
  urChoice400.text = "$4.00";
  urChoice400.style.fontWeight = "bold";
  minUnratedMenu.add(urChoice400);
  var urChoice500 = document.createElement("option");
  urChoice500.value = '5.00';
  urChoice500.text = "$5.00";
  urChoice500.style.fontWeight = "bold";
  minUnratedMenu.add(urChoice500);
  var urChoice600 = document.createElement("option");
  urChoice600.value = '6.00';
  urChoice600.text = "$6.00";
  urChoice600.style.fontWeight = "bold";
  minUnratedMenu.add(urChoice600);
  var urChoice700 = document.createElement("option");
  urChoice700.value = '7.00';
  urChoice700.text = "$7.00";
  urChoice700.style.fontWeight = "bold";
  minUnratedMenu.add(urChoice700);
  var urChoice800 = document.createElement("option");
  urChoice800.value = '8.00';
  urChoice800.text = "$8.00";
  urChoice800.style.fontWeight = "bold";
  minUnratedMenu.add(urChoice800);
  var urChoice900 = document.createElement("option");
  urChoice900.value = '9.00';
  urChoice900.text = "$9.00";
  urChoice900.style.fontWeight = "bold";
  minUnratedMenu.add(urChoice900);
  var urChoice1000 = document.createElement("option");
  urChoice1000.value = '10.00';
  urChoice1000.text = "$10.00";
  urChoice1000.style.fontWeight = "bold";
  minUnratedMenu.add(urChoice1000);
  minUnratedMenu.addEventListener(
    'change',
    function() {
      var minUnrated = minUnratedMenu.value;
      GM_setValue('minUnrated',minUnrated);},
    false
  );
  if (GM_getValue('minUnrated')) {
    getMenuDefault(minUnratedMenu, GM_getValue('minUnrated'));
  } else {
    minUnratedMenu.options[4].selected = 'selected';
    GM_setValue('minUnrated', '1.00');
  }

  var minTOMenu = document.createElement("select");
  minTOMenu.title = 'Minimum average pay rating on Turkopticon'
  minTOMenu.style.width ="150px";
  minTOMenu.style.margin = "5px";
  minTOMenu.style.border = "1px solid #544293";
  minTOMenu.style.borderRadius = "3px";
  minTOMenu.style.padding = "5px 10px 5px 10px";
  minTOMenu.style.display = "inline-block";
  minTOMenu.style.color = "#FFFFFF";
  minTOMenu.style.backgroundColor = "#6D59B4";
  minTOMenu.style.backgroundImage = "-webkit-linear-gradient(top, #6D59B4, #48358C)";
  menus.appendChild(minTOMenu);
  var toChoiceOff = document.createElement("option");
  toChoiceOff.value = '0';
  toChoiceOff.text = "Off";
  toChoiceOff.style.fontWeight = "bold";
  minTOMenu.add(toChoiceOff);
  var toChoice300 = document.createElement("option");
  toChoice300.value = '3.00';
  toChoice300.text = "3.00";
  toChoice300.style.fontWeight = "bold";
  minTOMenu.add(toChoice300);
  var toChoice325 = document.createElement("option");
  toChoice325.value = '3.25';
  toChoice325.text = "3.25";
  toChoice325.style.fontWeight = "bold";
  minTOMenu.add(toChoice325);
  var toChoice350 = document.createElement("option");
  toChoice350.value = '3.50';
  toChoice350.text = "3.50";
  toChoice350.style.fontWeight = "bold";
  minTOMenu.add(toChoice350);
  var toChoice375 = document.createElement("option");
  toChoice375.value = '3.75';
  toChoice375.text = "3.75";
  toChoice375.style.fontWeight = "bold";
  minTOMenu.add(toChoice375);
  var toChoice400 = document.createElement("option");
  toChoice400.value = '4.00';
  toChoice400.text = "4.00";
  toChoice400.style.fontWeight = "bold";
  minTOMenu.add(toChoice400);
  var toChoice425 = document.createElement("option");
  toChoice425.value = '4.25';
  toChoice425.text = "4.25";
  toChoice425.style.fontWeight = "bold";
  minTOMenu.add(toChoice425);
  var toChoice450 = document.createElement("option");
  toChoice450.value = '4.50';
  toChoice450.text = "4.50";
  toChoice450.style.fontWeight = "bold";
  minTOMenu.add(toChoice450);
  var toChoice475 = document.createElement("option");
  toChoice475.value = '4.75';
  toChoice475.text = "4.75";
  toChoice475.style.fontWeight = "bold";
  minTOMenu.add(toChoice475);
  var toChoice500 = document.createElement("option");
  toChoice500.value = '5.00';
  toChoice500.text = "5.00";
  toChoice500.style.fontWeight = "bold";
  minTOMenu.add(toChoice500);
  minTOMenu.addEventListener(
    'change',
    function() {
      var minTO = minTOMenu.value;
      GM_setValue('minTO',minTO);},
    false
  );
  if (GM_getValue('minTO')) {
    getMenuDefault(minTOMenu, GM_getValue('minTO'));
  } else {
    minTOMenu.options[5].selected = 'selected';
    GM_setValue('minTO', '4.00');
  }

  var minTVMenu = document.createElement("select");
  minTVMenu.title = 'Minimum average hourly wage rating on TurkerView';
  minTVMenu.style.width ="150px";
  minTVMenu.style.margin = "5px";
  minTVMenu.style.border = "1px solid #544293";
  minTVMenu.style.fontSize = "12px";
  minTVMenu.style.padding = "5px 10px 5px 10px";
  minTVMenu.style.display = "inline-block";
  minTVMenu.style.color = "#FFFFFF";
  minTVMenu.style.backgroundColor = "#6D59B4";
  minTVMenu.style.backgroundImage = "-webkit-linear-gradient(top, #6D59B4, #48358C)";
  menus.appendChild(minTVMenu);
  var tvChoiceOff = document.createElement("option");
  tvChoiceOff.value = '0';
  tvChoiceOff.text = "Off";
  tvChoiceOff.style.fontWeight = "bold";
  minTVMenu.add(tvChoiceOff);
  var tvChoice10 = document.createElement("option");
  tvChoice10.value = '10.00';
  tvChoice10.text = "$10.00/hr";
  tvChoice10.style.fontWeight = "bold";
  minTVMenu.add(tvChoice10);
  var tvChoice11 = document.createElement("option");
  tvChoice11.value = '11.00';
  tvChoice11.text = "$11.00/hr";
  tvChoice11.style.fontWeight = "bold";
  minTVMenu.add(tvChoice11);
  var tvChoice12 = document.createElement("option");
  tvChoice12.value = '12.00';
  tvChoice12.text = "$12.00/hr";
  tvChoice12.style.fontWeight = "bold";
  minTVMenu.add(tvChoice12);
  var tvChoice13 = document.createElement("option");
  tvChoice13.value = '13.00';
  tvChoice13.text = "$13.00/hr";
  tvChoice13.style.fontWeight = "bold";
  minTVMenu.add(tvChoice13);
  var tvChoice14 = document.createElement("option");
  tvChoice14.value = '14.00';
  tvChoice14.text = "$14.00/hr";
  tvChoice14.style.fontWeight = "bold";
  minTVMenu.add(tvChoice14);
  var tvChoice15 = document.createElement("option");
  tvChoice15.value = '15.00';
  tvChoice15.text = "$15.00/hr";
  tvChoice15.style.fontWeight = "bold";
  minTVMenu.add(tvChoice15);
  var tvChoice16 = document.createElement("option");
  tvChoice16.value = '16.00';
  tvChoice16.text = "$16.00/hr";
  tvChoice16.style.fontWeight = "bold";
  minTVMenu.add(tvChoice16);
  var tvChoice17 = document.createElement("option");
  tvChoice17.value = '17.00';
  tvChoice17.text = "$17.00/hr";
  tvChoice17.style.fontWeight = "bold";
  minTVMenu.add(tvChoice17);
  var tvChoice18 = document.createElement("option");
  tvChoice18.value = '18.00';
  tvChoice18.text = "$18.00/hr";
  tvChoice18.style.fontWeight = "bold";
  minTVMenu.add(tvChoice18);
  var tvChoice19 = document.createElement("option");
  tvChoice19.value = '19.00';
  tvChoice19.text = "$19.00/hr";
  tvChoice19.style.fontWeight = "bold";
  minTVMenu.add(tvChoice19);
  var tvChoice20 = document.createElement("option");
  tvChoice20.value = '20.00';
  tvChoice20.text = "$20.00/hr";
  tvChoice20.style.fontWeight = "bold";
  minTVMenu.add(tvChoice20);
  minTVMenu.addEventListener(
    'change',
    function() {
      var minTV = minTVMenu.value;
      GM_setValue('minTV',minTV);},
    false
  );
  if (GM_getValue('minTV')) {
    getMenuDefault(minTVMenu, GM_getValue('minTV'));
  } else {
    minTVMenu.options[5].selected = 'selected';
    GM_setValue('minTV', '14.00');
  }

  /* Buttons and Counters and Stuff */

  var buttonRow = document.createElement('div');
  document.getElementsByTagName('table')[0].appendChild(buttonRow);

  var scanTime = document.createElement('span');
  buttonRow.appendChild(scanTime);
  scanTime.innerHTML = "Last scan:";
  scanTime.style.margin = '18px 0px 0px 6px';

  var preNum = 0;
  var pres = document.createElement('span');
  document.getElementsByTagName('table')[0].appendChild(pres);
  pres.innerHTML = "PREs: " + preNum;
  pres.style.paddingLeft = '6px';
  pres.style.marginTop = '18px';

  var getNum = 0.00;
  var getTotal = document.createElement('span');
  document.getElementsByTagName('table')[0].appendChild(getTotal);
  getTotal.innerHTML = "Total caught: $" + getNum.toFixed(2);
  getTotal.style.margin = '18px 0px 0px 12px';

  var settingsBtn = document.createElement('button');
  settingsBtn.id = "setBtn";
  settingsBtn.innerHTML = "<i class='fa fa-bars'></i>";
  buttonRow.appendChild(settingsBtn);
  settingsBtn.style.height ="34px";
  settingsBtn.style.width ="35px";
  settingsBtn.style.float = "right";
  settingsBtn.style.border = "1px solid #544293";
  settingsBtn.style.borderRadius = "3px";
  settingsBtn.style.fontSize = "20px";
  settingsBtn.style.paddingLeft = "8px";
  settingsBtn.style.margin = "5px";
  settingsBtn.style.display = "inline-block";
  settingsBtn.style.color = "#FFFFFF";
  settingsBtn.style.backgroundColor = "#6D59B4";
  settingsBtn.style.backgroundImage = "-webkit-linear-gradient(top, #6D59B4, #48358C)";

  var logBtn = document.createElement('button');
  logBtn.id = "logBtn";
  logBtn.innerHTML = "Log";
  buttonRow.appendChild(logBtn);
  logBtn.style.height ="34px";
  logBtn.style.width ="75px";
  logBtn.style.float = "right";
  logBtn.style.border = "1px solid #544293";
  logBtn.style.borderRadius = "3px";
  logBtn.style.fontSize = "12px";
  logBtn.style.padding = "5px 10px 5px 10px";
  logBtn.style.margin = "5px";
  logBtn.style.display = "inline-block";
  logBtn.style.color = "#FFFFFF";
  logBtn.style.backgroundColor = "#6D59B4";
  logBtn.style.backgroundImage = "-webkit-linear-gradient(top, #6D59B4, #48358C)";

  var includesBtn = document.createElement('button');
  includesBtn.id = "incBtn";
  includesBtn.innerHTML = "Include List";
  buttonRow.appendChild(includesBtn);
  includesBtn.style.height ="34px";
  includesBtn.style.width ="120px";
  includesBtn.style.float = "right";
  includesBtn.style.border = "1px solid #36658c";
  includesBtn.style.borderRadius = "3px";
  includesBtn.style.fontSize = "12px";
  includesBtn.style.padding = "5px 10px 5px 10px";
  includesBtn.style.margin = "5px";
  includesBtn.style.display = "inline-block";
  includesBtn.style.color = "#FFFFFF";
  includesBtn.style.backgroundColor = "#4682B4";
  includesBtn.style.backgroundImage = "-webkit-linear-gradient(top, #4682B4, #1D517B)";

  var blockBtn = document.createElement('button');
  blockBtn.id = "blkBtn";
  blockBtn.innerHTML = "Block List";
  buttonRow.appendChild(blockBtn);
  blockBtn.style.height ="34px";
  blockBtn.style.width ="120px";
  blockBtn.style.float = "right";
  blockBtn.style.border = "1px solid #7a3c8a";
  blockBtn.style.borderRadius = "3px";
  blockBtn.style.fontSize = "12px";
  blockBtn.style.padding = "5px 10px 5px 10px";
  blockBtn.style.margin = "5px";
  blockBtn.style.display = "inline-block";
  blockBtn.style.color = "#FFFFFF";
  blockBtn.style.backgroundColor = "#9D4DB1";
  blockBtn.style.backgroundImage = "-webkit-linear-gradient(top, #9D4DB1, #5E2E6A)";

  var scanRow = document.createElement('div');
  document.getElementsByTagName('table')[0].appendChild(scanRow);
  scanRow.style.marginTop = '6px';

  var minRated;
  var minUnrated;
  var minTO;
  var minTV;
  async function parse() {
    var d = new Date();
    var hours = (d.getHours() % 12) ? (d.getHours() % 12) : 12;
    var minutes = d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes();
    var seconds = ('0' + d.getSeconds()).slice(-2);
    var ampm = d.getHours() >= 12 ? ' PM' : ' AM';
    var time = hours + ":" + minutes + ":" + seconds + ampm;
    var startLoad = Date.now();
    scanTime.innerHTML = "Last scan: " + time;
    eTime = Math.floor((new Date).getTime()/1000);
    if (GM_getValue("run") === "running") {
      var scanDelay;
      var scanRate = GM_getValue('scanFreq');
      minUnrated = GM_getValue('minUnrated');
      minRated = GM_getValue('minRated');
      minTO = GM_getValue('minTO');
      minTV = GM_getValue('minTV');
      if (GM_getValue('missLog')) {
        missLog = await JSON.parse(GM_getValue('missLog'));
      } else {
        missLog = [];
      }
      if (GM_getValue('toLog')) {
        toLog = await JSON.parse(GM_getValue('toLog'));
      } else {
        toLog = [];
      }
      if (GM_getValue('tvLog')) {
        tvLog = await JSON.parse(GM_getValue('tvLog'));
      } else {
        tvLog = [];
      }
      await runWatchers();
      await purgeLog();
      await GM_setValue('missLog', JSON.stringify(missLog));
      await GM_setValue('toLog', JSON.stringify(toLog));
      await GM_setValue('tvLog', JSON.stringify(tvLog));
      var loadTime = Date.now() - startLoad;
      if (scanRate - loadTime > 0) {
        scanDelay = scanRate - loadTime;
      } else {
        scanDelay = 0;
      }
      await getRunningPandas()
      await runPandas();
      await GM_setValue('pandaCards', JSON.stringify(pandaCards));
      setTimeout(async function() {
        await parse();
      },scanDelay);
    };
  };

  GM_setValue("run", "off");

  function scanOn() {
    GM_setValue("run", "running");
    run.value = "Scanning";
    run.style.border = "1px solid #7a3c8a";
    run.style.backgroundColor = "#9D4DB1";
    run.style.backgroundImage = "-webkit-linear-gradient(top, #9D4DB1, #5E2E6A)";
    parse();
  }

  function scanOff() {
    GM_setValue("run", "off");
    run.value = "Scan";
    run.style.border = "1px solid #36658c";
    run.style.backgroundColor = "#4682B4";
    run.style.backgroundImage = "-webkit-linear-gradient(top, #4682B4, #1D517B)";
    watchForPandas();
  }

  function scan() {
    if (GM_getValue("run") === "running"){
      scanOff();
    } else {
      scanOn();
    };
  };

  var run = document.createElement("input");
  run.type = "button";
  run.value = "Scan";
  scanRow.appendChild(run);
  run.style.width ="120px";
  run.style.border = "1px solid #36658c";
  run.style.borderRadius = "3px";
  run.style.fontSize = "12px";
  run.style.padding = "5px 10px 5px 10px";
  run.style.marginLeft = "6px";
  run.style.display = "inline-block";
  run.style.color = "#FFFFFF";
  run.style.backgroundColor = "#4682B4";
  run.style.backgroundImage = "-webkit-linear-gradient(top, #4682B4, #1D517B)";
  run.addEventListener("click", scan, false);

  var addPandaBtn = document.createElement('button');
  addPandaBtn.id = "addPandaBtn";
  addPandaBtn.innerHTML = "Add Panda";
  scanRow.appendChild(addPandaBtn);
  addPandaBtn.style.height ="34px";
  addPandaBtn.style.width ="100px";
  addPandaBtn.style.float = "right";
  addPandaBtn.style.border = "1px solid #005353";
  addPandaBtn.style.borderRadius = "3px";
  addPandaBtn.style.fontSize = "12px";
  addPandaBtn.style.padding = "5px 10px 5px 10px";
  addPandaBtn.style.marginRight = "6px";
  addPandaBtn.style.display = "inline-block";
  addPandaBtn.style.color = "#FFFFFF";
  addPandaBtn.style.backgroundColor = "#008B8B";
  addPandaBtn.style.backgroundImage = "-webkit-linear-gradient(top, #008B8B, #005656)";

  /* Panda Stuff */

  var pandaSection = document.createElement('div');
  document.getElementsByTagName('table')[0].appendChild(pandaSection);

  var pandasDivide = document.createElement('hr');
  pandaSection.appendChild(pandasDivide);
  pandasDivide.style.backgroundColor = '#333333';
  pandasDivide.style.align = 'center';
  pandasDivide.style.height = '1px';
  pandasDivide.style.width = '800px';

  var pandasHeader = document.createElement('div');
  pandaSection.appendChild(pandasHeader);

  var pandas = document.createElement('div');
  pandaSection.appendChild(pandas);
  pandas.style.width = '800px';

  /* Queue Stuff */

  var qSection = document.createElement('div');
  qSection.style.width = '100%';
  qSection.style.minHeight = '150px';
  qSection.style.margin = '16px 0px 0px 0px';
  qSection.style.padding = '6px';
  qSection.style.border = '1px solid #333333';
  qSection.style.display = 'none';
  document.getElementsByTagName('table')[0].appendChild(qSection);

  var qContent = document.createElement('div');
  qSection.appendChild(qContent);
  qContent.style.color = '#008B8B'
  qContent.style.fontSize = '16'
  qContent.style.margin = '6px';
  qContent.innerHTML = '';

  /* Modal Windows */

  var blkModal = document.createElement('div');
  document.getElementsByTagName('table')[0].appendChild(blkModal);
  blkModal.id = "bModal";
  blkModal.classList.add("modal");
  blkModal.innerHTML =
    '<div class="modal-content">' +
    '<span class="close">&times;</span>' +
    '</div>'
  blkModal.style.position = 'fixed';
  blkModal.style.zIndex = '1';
  blkModal.style.left = '0';
  blkModal.style.top = '0';
  blkModal.style.width = '100%';
  blkModal.style.height = '100%';
  blkModal.style.backgroundColor = 'rgb(0,0,0)';
  blkModal.style.backgroundColor = 'rgba(0,0,0,0.5)';
  blkModal.style.overflow = 'auto';
  blkModal.style.display = 'hidden';

  var bListWindow = document.createElement('div');
  blkModal.appendChild(bListWindow);
  bListWindow.style.color = '#008B8B'
  bListWindow.style.backgroundColor = "#212121";
  bListWindow.style.fontSize = '16'
  bListWindow.style.margin = '5% auto';
  bListWindow.style.padding = '20px';
  bListWindow.style.border = '1px solid #1C1C1C';
  bListWindow.style.width = '450px';
  bListWindow.style.height = 'auto';
  bListWindow.style.minHeight = '400px';
  bListWindow.style.borderRadius = "3px";
  bListWindow.style.fontSize = "12px";
  bListWindow.style.padding = "5px 10px 5px 10px";
  bListWindow.style.overflow = 'visible';

  var bAddModal = document.createElement('div');
  document.getElementsByTagName('table')[0].appendChild(bAddModal);
  bAddModal.id = "bAddModal";
  bAddModal.classList.add("modal");
  bAddModal.innerHTML =
    '<div class="modal-content">' +
    '<span class="close">&times;</span>' +
    '</div>'
  bAddModal.style.position = 'fixed';
  bAddModal.style.zIndex = '1';
  bAddModal.style.left = '0';
  bAddModal.style.top = '0';
  bAddModal.style.width = '100%';
  bAddModal.style.height = '100%';
  bAddModal.style.backgroundColor = 'rgb(0,0,0)';
  bAddModal.style.backgroundColor = 'rgba(0,0,0,0.5)';
  bAddModal.style.overflow = 'auto';
  bAddModal.style.display = 'hidden';

  var bAddWindow = document.createElement('div');
  bAddModal.appendChild(bAddWindow);
  bAddWindow.style.color = '#008B8B'
  bAddWindow.style.backgroundColor = "#212121";
  bAddWindow.style.fontSize = '16'
  bAddWindow.style.margin = '6% auto';
  bAddWindow.style.padding = '20px';
  bAddWindow.style.border = '1px solid #1C1C1C';
  bAddWindow.style.width = '360px';
  bAddWindow.style.height = '242px';
  bAddWindow.style.borderRadius = "3px";
  bAddWindow.style.fontSize = "12px";
  bAddWindow.style.padding = "5px 10px 5px 10px";
  bAddWindow.style.overflow = 'visible';

  var bEditModal = document.createElement('div');
  document.getElementsByTagName('table')[0].appendChild(bEditModal);
  bEditModal.id = "bEditModal";
  bEditModal.classList.add("modal");
  bEditModal.innerHTML =
    '<div class="modal-content">' +
    '<span class="close">&times;</span>' +
    '</div>'
  bEditModal.style.position = 'fixed';
  bEditModal.style.zIndex = '1';
  bEditModal.style.left = '0';
  bEditModal.style.top = '0';
  bEditModal.style.width = '100%';
  bEditModal.style.height = '100%';
  bEditModal.style.backgroundColor = 'rgb(0,0,0)';
  bEditModal.style.backgroundColor = 'rgba(0,0,0,0.5)';
  bEditModal.style.overflow = 'auto';
  bEditModal.style.display = 'hidden';

  var bEditWindow = document.createElement('div');
  bEditModal.appendChild(bEditWindow);
  bEditWindow.style.color = '#008B8B'
  bEditWindow.style.backgroundColor = "#212121";
  bEditWindow.style.fontSize = '16'
  bEditWindow.style.margin = '6% auto';
  bEditWindow.style.padding = '20px';
  bEditWindow.style.border = '1px solid #1C1C1C';
  bEditWindow.style.width = '360px';
  bEditWindow.style.height = '242px';
  bEditWindow.style.borderRadius = "3px";
  bEditWindow.style.fontSize = "12px";
  bEditWindow.style.padding = "5px 10px 5px 10px";
  bEditWindow.style.overflow = 'visible';

  var incModal = document.createElement('div');
  document.getElementsByTagName('table')[0].appendChild(incModal);
  incModal.id = "iModal";
  incModal.classList.add("modal");
  incModal.innerHTML =
    '<div class="modal-content">' +
    '<span class="close">&times;</span>' +
    '</div>'
  incModal.style.position = 'fixed';
  incModal.style.zIndex = '1';
  incModal.style.left = '0';
  incModal.style.top = '0';
  incModal.style.width = '100%';
  incModal.style.height = '100%';
  incModal.style.backgroundColor = 'rgb(0,0,0)';
  incModal.style.backgroundColor = 'rgba(0,0,0,0.5)';
  incModal.style.overflow = 'auto';
  incModal.style.display = 'hidden';

  var iListWindow = document.createElement('div');
  incModal.appendChild(iListWindow);
  iListWindow.style.color = '#008B8B'
  iListWindow.style.backgroundColor = "#212121";
  iListWindow.style.fontSize = '16'
  iListWindow.style.margin = '5% auto';
  iListWindow.style.padding = '20px';
  iListWindow.style.border = '1px solid #1C1C1C';
  iListWindow.style.width = '450px';
  iListWindow.style.height = 'auto';
  iListWindow.style.minHeight = '400px';
  iListWindow.style.borderRadius = "3px";
  iListWindow.style.fontSize = "12px";
  iListWindow.style.padding = "5px 10px 5px 10px";
  iListWindow.style.overflow = 'visible';

  var iAddModal = document.createElement('div');
  document.getElementsByTagName('table')[0].appendChild(iAddModal);
  iAddModal.id = "iAddModal";
  iAddModal.classList.add("modal");
  iAddModal.innerHTML =
    '<div class="modal-content">' +
    '<span class="close">&times;</span>' +
    '</div>'
  iAddModal.style.position = 'fixed';
  iAddModal.style.zIndex = '1';
  iAddModal.style.left = '0';
  iAddModal.style.top = '0';
  iAddModal.style.width = '100%';
  iAddModal.style.height = '100%';
  iAddModal.style.backgroundColor = 'rgb(0,0,0)';
  iAddModal.style.backgroundColor = 'rgba(0,0,0,0.5)';
  iAddModal.style.overflow = 'auto';
  iAddModal.style.display = 'hidden';

  var iAddWindow = document.createElement('div');
  iAddModal.appendChild(iAddWindow);
  iAddWindow.style.color = '#008B8B'
  iAddWindow.style.backgroundColor = "#212121";
  iAddWindow.style.fontSize = '16'
  iAddWindow.style.margin = '6% auto';
  iAddWindow.style.padding = '20px';
  iAddWindow.style.border = '1px solid #1C1C1C';
  iAddWindow.style.width = '360px';
  iAddWindow.style.height = '410px';
  iAddWindow.style.borderRadius = "3px";
  iAddWindow.style.fontSize = "12px";
  iAddWindow.style.padding = "5px 10px 5px 10px";
  iAddWindow.style.overflow = 'visible';

  var iEditModal = document.createElement('div');
  document.getElementsByTagName('table')[0].appendChild(iEditModal);
  iEditModal.id = "iEditModal";
  iEditModal.classList.add("modal");
  iEditModal.innerHTML =
    '<div class="modal-content">' +
    '<span class="close">&times;</span>' +
    '</div>'
  iEditModal.style.position = 'fixed';
  iEditModal.style.zIndex = '1';
  iEditModal.style.left = '0';
  iEditModal.style.top = '0';
  iEditModal.style.width = '100%';
  iEditModal.style.height = '100%';
  iEditModal.style.backgroundColor = 'rgb(0,0,0)';
  iEditModal.style.backgroundColor = 'rgba(0,0,0,0.5)';
  iEditModal.style.overflow = 'auto';
  iEditModal.style.display = 'hidden';

  var iEditWindow = document.createElement('div');
  iEditModal.appendChild(iEditWindow);
  iEditWindow.style.color = '#008B8B'
  iEditWindow.style.backgroundColor = "#212121";
  iEditWindow.style.fontSize = '16'
  iEditWindow.style.margin = '6% auto';
  iEditWindow.style.padding = '20px';
  iEditWindow.style.border = '1px solid #1C1C1C';
  iEditWindow.style.width = '360px';
  iEditWindow.style.height = '410px';
  iEditWindow.style.borderRadius = "3px";
  iEditWindow.style.fontSize = "12px";
  iEditWindow.style.padding = "5px 10px 5px 10px";
  iEditWindow.style.overflow = 'visible';

  var logModal = document.createElement('div');
  document.getElementsByTagName('table')[0].appendChild(logModal);
  logModal.id = "lModal";
  logModal.classList.add("modal");
  logModal.innerHTML =
    '<div class="modal-content">' +
    '<span class="close">&times;</span>' +
    '</div>'
  logModal.style.position = 'fixed';
  logModal.style.zIndex = '1';
  logModal.style.left = '0';
  logModal.style.top = '0';
  logModal.style.width = '100%';
  logModal.style.height = '100%';
  logModal.style.backgroundColor = 'rgb(0,0,0)';
  logModal.style.backgroundColor = 'rgba(0,0,0,0.5)';
  logModal.style.overflow = 'auto';
  logModal.style.display = 'hidden';

  var logWindow = document.createElement('div');
  logModal.appendChild(logWindow);
  logWindow.style.color = '#008B8B'
  logWindow.style.backgroundColor = "#212121";
  logWindow.style.fontSize = '16'
  logWindow.style.margin = '5% auto';
  logWindow.style.padding = '20px';
  logWindow.style.border = '1px solid #1C1C1C';
  logWindow.style.width = '600px';
  logWindow.style.minHeight = '300px';
  logWindow.style.height = 'auto';
  logWindow.style.borderRadius = "3px";
  logWindow.style.fontSize = "12px";
  logWindow.style.padding = '5px 10px 5px 10px';
  logWindow.style.overflow = 'visible';

  var setModal = document.createElement('div');
  document.getElementsByTagName('table')[0].appendChild(setModal);
  setModal.id = "sModal";
  setModal.classList.add("modal");
  setModal.innerHTML =
    '<div class="modal-content">' +
    '<span class="close">&times;</span>' +
    '</div>'
  setModal.style.position = 'fixed';
  setModal.style.zIndex = '1';
  setModal.style.left = '0';
  setModal.style.top = '0';
  setModal.style.width = '100%';
  setModal.style.height = '100%';
  setModal.style.backgroundColor = 'rgb(0,0,0)';
  setModal.style.backgroundColor = 'rgba(0,0,0,0.5)';
  setModal.style.display = 'hidden';

  var setWindow = document.createElement('div');
  setModal.appendChild(setWindow);
  setWindow.style.color = '#008B8B'
  setWindow.style.backgroundColor = "#212121";
  setWindow.style.fontSize = '16'
  setWindow.style.margin = '5% auto';
  setWindow.style.padding = '20px';
  setWindow.style.border = '1px solid #1C1C1C';
  setWindow.style.width = '360px';
  setWindow.style.height = '178px';
  setWindow.style.borderRadius = "3px";
  setWindow.style.fontSize = "12px";
  setWindow.style.padding = "5px 10px 5px 10px";

  var pAddModal = document.createElement('div');
  document.getElementsByTagName('table')[0].appendChild(pAddModal);
  pAddModal.id = "pAddModal";
  pAddModal.classList.add("modal");
  pAddModal.innerHTML =
    '<div class="modal-content">' +
    '<span class="close">&times;</span>' +
    '</div>'
  pAddModal.style.position = 'fixed';
  pAddModal.style.zIndex = '1';
  pAddModal.style.left = '0';
  pAddModal.style.top = '0';
  pAddModal.style.width = '100%';
  pAddModal.style.height = '100%';
  pAddModal.style.backgroundColor = 'rgb(0,0,0)';
  pAddModal.style.backgroundColor = 'rgba(0,0,0,0.5)';
  pAddModal.style.overflow = 'auto';
  pAddModal.style.display = 'hidden';

  var pAddWindow = document.createElement('div');
  pAddModal.appendChild(pAddWindow);
  pAddWindow.style.color = '#008B8B'
  pAddWindow.style.backgroundColor = "#212121";
  pAddWindow.style.fontSize = '16'
  pAddWindow.style.margin = '6% auto';
  pAddWindow.style.padding = '20px';
  pAddWindow.style.border = '1px solid #1C1C1C';
  pAddWindow.style.width = '360px';
  pAddWindow.style.height = '279px';
  pAddWindow.style.borderRadius = "3px";
  pAddWindow.style.fontSize = "12px";
  pAddWindow.style.padding = "5px 10px 5px 10px";
  pAddWindow.style.overflow = 'visible';

  var pEditModal = document.createElement('div');
  document.getElementsByTagName('table')[0].appendChild(pEditModal);
  pEditModal.id = "pEditModal";
  pEditModal.classList.add("modal");
  pEditModal.innerHTML =
    '<div class="modal-content">' +
    '<span class="close">&times;</span>' +
    '</div>'
  pEditModal.style.position = 'fixed';
  pEditModal.style.zIndex = '1';
  pEditModal.style.left = '0';
  pEditModal.style.top = '0';
  pEditModal.style.width = '100%';
  pEditModal.style.height = '100%';
  pEditModal.style.backgroundColor = 'rgb(0,0,0)';
  pEditModal.style.backgroundColor = 'rgba(0,0,0,0.5)';
  pEditModal.style.overflow = 'auto';
  pEditModal.style.display = 'hidden';

  var pEditWindow = document.createElement('div');
  pEditModal.appendChild(pEditWindow);
  pEditWindow.style.color = '#008B8B'
  pEditWindow.style.backgroundColor = "#212121";
  pEditWindow.style.fontSize = '16'
  pEditWindow.style.margin = '6% auto';
  pEditWindow.style.padding = '20px';
  pEditWindow.style.border = '1px solid #1C1C1C';
  pEditWindow.style.width = '360px';
  pEditWindow.style.height = '279px';
  pEditWindow.style.borderRadius = "3px";
  pEditWindow.style.fontSize = "12px";
  pEditWindow.style.padding = "5px 10px 5px 10px";
  pEditWindow.style.overflow = 'visible';

  var closeBlkModal = document.getElementsByClassName("close")[0];
  var closeBAddModal = document.getElementsByClassName("close")[1];
  var closeBEditModal = document.getElementsByClassName("close")[2];
  var closeIncModal = document.getElementsByClassName("close")[3];
  var closeIAddModal = document.getElementsByClassName("close")[4];
  var closeIEditModal = document.getElementsByClassName("close")[5];
  var closeLogModal = document.getElementsByClassName("close")[6];
  var closeSetModal = document.getElementsByClassName("close")[7];
  var closePAddModal = document.getElementsByClassName("close")[8];
  var closePEditModal = document.getElementsByClassName("close")[9];

  blockBtn.onclick = function() {
    blkModal.style.display = "block";
  }

  includesBtn.onclick = function() {
    incModal.style.display = "block";
  }

  logBtn.onclick = function() {
    logModal.style.display = "block";
  }

  settingsBtn.onclick = function() {
    setModal.style.display = "block";
  }

  addPandaBtn.onclick = function() {
    pAddModal.style.display = "block";
  }

  closeBlkModal.onclick = function() {
    blkModal.style.display = "none";
  }

  closeBAddModal.onclick = function() {
    bAddModal.style.display = "none";
  }

  closeIncModal.onclick = function() {
    incModal.style.display = "none";
  }

  closeIAddModal.onclick = function() {
    iAddModal.style.display = "none";
  }

  closeLogModal.onclick = function() {
    logModal.style.display = "none";
  }

  closeSetModal.onclick = function() {
    setModal.style.display = "none";
  }

  closePAddModal.onclick = function() {
    pAddModal.style.display = "none";
  }

  window.onclick = function(event) {
    if (event.target == blkModal) {
      blkModal.style.display = "none";
    }
    if (event.target == bAddModal) {
      bAddModal.style.display = "none";
    }
    if (event.target == bEditModal) {
      bEditModal.style.display = "none";
    }
    if (event.target == incModal) {
      incModal.style.display = "none";
    }
    if (event.target == iAddModal) {
      iAddModal.style.display = "none";
    }
    if (event.target == iEditModal) {
      iEditModal.style.display = "none";
    }
    if (event.target == logModal) {
      logModal.style.display = "none";
    }
    if (event.target == setModal) {
      setModal.style.display = "none";
    }
    if (event.target == pAddModal) {
      pAddModal.style.display = "none";
    }
    if (event.target == pEditModal) {
      pEditModal.style.display = "none";
    }
  }

  var bListTop = document.createElement('div');
  bListWindow.appendChild(bListTop);
  bListTop.style.height = '24px';

  var blockLabel = document.createElement('span');
  bListTop.appendChild(blockLabel);
  blockLabel.innerHTML = 'Block List';
  blockLabel.style.fontSize = '20px';
  blockLabel.style.marginLeft = '6px';
  blockLabel.style.marginTop = '18px';
  blockLabel.style.fontWeight = 'bold';

  var bListClose = document.querySelector("#bModal > div > span");
  bListTop.appendChild(bListClose);
  bListClose.type = "button";
  bListClose.style.float = 'right';
  bListClose.style.lineHeight = '1.5rem';
  bListClose.style.textAlign = 'center';
  bListClose.style.opacity = "0.9";
  bListClose.style.cursor = 'pointer';
  bListClose.innerHTML = "<i class='fa fa-times'></i>";
  bListClose.style.backgroundColor = "#6D59B4";
  bListClose.style.border = "1px solid #544293";
  bListClose.style.backgroundImage = "-webkit-linear-gradient(top, #6D59B4, #48358C)";
  bListClose.style.color = "#FFFFFF";
  bListClose.style.fontSize = '14px'
  bListClose.style.fontWeight = "bold";
  bListClose.style.borderRadius = "3px";
  bListClose.style.width ="23px";
  bListClose.style.padding ="0px 5px 0px 5px";
  bListClose.style.margin = "4px";

  var bListTopDivide = document.createElement('hr');
  bListWindow.appendChild(bListTopDivide);
  bListTopDivide.style.backgroundColor = '#333333';
  bListTopDivide.style.align = 'center';
  bListTopDivide.style.height = '1px';
  bListTopDivide.style.width = '420px';
  bListTopDivide.style.margin = '13px 0px 6px 3px';

  var blocks = document.createElement('div');
  bListWindow.appendChild(blocks);
  blocks.style.height = 'auto';
  blocks.style.minHeight = '320px';

  function scrapBlock(button) {
    var i = 0;
    for (i = 0; i < blockList.length; i++) {
      if (blockList[i][0].trim() === button.value.trim()) {
        blockList.splice(i, 1);
        GM_setValue("blockList", JSON.stringify(blockList));
        button.remove();
      }
    }
    bEditModal.style.display = "none";
  }

  var bName = blockList.sort(([a], [b]) => a.toLowerCase().localeCompare(b.toLowerCase()));

  var selectedBlock;
  function populateBlockButtons() {
    var i = 0;
    for (i = 0; i < blockList.length; i++) {
      var bAdd = document.createElement("input");
      bAdd.type = "button";
      bAdd.setAttribute("class","bButton");
      bAdd.setAttribute("title", bName[i][1]);
      bAdd.setAttribute("blockall", bName[i][2]);
      bAdd.setAttribute("maxpay", bName[i][3]);
      bAdd.value = bName[i][0];
      bAdd.style.marginRight = "0";
      bAdd.style.width ="auto";
      blocks.appendChild(bAdd);
      bAdd.style.border = "1px solid #7a3c8a";
      bAdd.style.borderRadius = "3px";
      bAdd.style.fontSize = "12px";
      bAdd.style.padding = "5px 10px 5px 10px";
      bAdd.style.textDecoration = "none";
      bAdd.style.display = "inline-block";
      bAdd.style.color = "#FFFFFF";
      bAdd.style.backgroundColor = "#9D4DB1";
      bAdd.style.backgroundImage = "-webkit-linear-gradient(top, #9D4DB1, #5E2E6A)";
      bAdd.style.margin = "5px";

      bAdd.onclick = function() {
        selectedBlock = this;
        editBlock(this);
        bEditModal.style.display = "block";
      }

      closeBEditModal.onclick = function() {
        bEditModal.style.display = "none";
      }
    }
  }
  populateBlockButtons();

  function editBlock(button) {
    bEditMatchInput.value = button.title;
    bEditNameInput.value = button.value;
    if (button.getAttribute('blockall') == 'No') {
      bEditBAllMenu.value = 'No'
      bEditBPayOptions.style.opacity = '1';
      bEditBPayInput.disabled = false;
      bEditBPayInput.value = button.getAttribute('maxpay');
    } else {
      bEditBAllMenu.value = 'Yes';
      bEditBPayOptions.style.opacity = '0.25';
      bEditBPayInput.disabled = true;
      bEditBPayInput.value = button.getAttribute('maxpay');
    }
  }

  var bButtons = document.getElementsByClassName('bButton');

  function scrapAllBlockButtons() {
    var i = 0;
    for (i = 0; i < blockList.length; i++) {
      bButtons[i].remove();
      i--;
    }
  }

  var bListBotDivide = document.createElement('hr');
  bListWindow.appendChild(bListBotDivide);
  bListBotDivide.style.backgroundColor = '#333333';
  bListBotDivide.style.align = 'center';
  bListBotDivide.style.height = '1px';
  bListBotDivide.style.width = '420px';
  bListBotDivide.style.margin = '6px 0px 6px 3px';

  var bListBot = document.createElement('div');
  bListWindow.appendChild(bListBot);
  bListBot.style.margin = '0px 4px 0px 2px';

  function bNameSearch(name) {
    var nameLogged = false;
    var i = 0;
    for (i = 0; i < blockList.length; i++) {
      if (blockList[i][0].toLowerCase().trim() === name.toLowerCase().trim()) {
        nameLogged = true;
      }
    }
    return nameLogged;
  }

  function addNewBlock() {
    var match = bAddMatchInput.value;
    if (match.includes('worker.mturk.com/projects/')) {
      match = match.split('projects/')[1].split('/tasks')[0];
    }
    var name = bAddNameInput.value;
    if (
      match !== null &&
      match !== '' &&
      name !== null &&
      name !== '' &&
      bNameSearch(name) !== true
    ) {
      blockList.push([name, match, bAddBAllMenu.value, bAddBPayInput.value]);
      GM_setValue("blockList", JSON.stringify(blockList));
      var bAdd = document.createElement("input");
      bAdd.type = "button";
      bAdd.setAttribute("class","bButton");
      bAdd.setAttribute("title", match);
      bAdd.setAttribute("blockall", bAddBAllMenu.value);
      bAdd.setAttribute("maxpay", bAddBPayInput.value);
      bAdd.value = name;
      bAdd.style.marginRight = "0";
      bAdd.style.width ="auto";
      blocks.appendChild(bAdd);
      bAdd.style.border = "1px solid #7a3c8a";
      bAdd.style.borderRadius = "3px";
      bAdd.style.fontSize = "12px";
      bAdd.style.padding = "5px 10px 5px 10px";
      bAdd.style.display = "inline-block";
      bAdd.style.color = "#FFFFFF";
      bAdd.style.backgroundColor = "#9D4DB1";
      bAdd.style.backgroundImage = "-webkit-linear-gradient(top, #9D4DB1, #5E2E6A)";
      bAdd.style.margin = "5px";
      bAddModal.style.display = "none";

      bAdd.onclick = function() {
        selectedBlock = this;
        editBlock(this);
        bEditModal.style.display = "block";
      }

      closeBAddModal.onclick = function() {
        bAddModal.style.display = "none";
      }
    }
    else if (
      match !== null &&
      match !== '' &&
      name !== null &&
      name !== '' &&
      bNameSearch(name) == true
    ) {
      alert('Please choose a unique name for this block.')
    } else {
      bAddModal.style.display = "none";
    }
  }

  async function updateBlock(button) {
    var match = bEditMatchInput.value;
    if (match.includes('worker.mturk.com/projects/')) {
      match = match.split('projects/')[1].split('/tasks')[0];
    }
    var name = bEditNameInput.value;
    if (
      match !== null &&
      match !== '' &&
      name !== null &&
      name !== '' &&
      (bNameSearch(name) !== true ||
       name.toLowerCase() == button.value.toLowerCase())
    ) {
      await scrapBlock(button);
      blockList.push([name, match, bEditBAllMenu.value, bEditBPayInput.value]);
      GM_setValue("blockList", JSON.stringify(blockList));
      var bAdd = document.createElement("input");
      bAdd.type = "button";
      bAdd.setAttribute("class","bButton");
      bAdd.setAttribute("title", match);
      bAdd.setAttribute("blockall", bEditBAllMenu.value);
      bAdd.setAttribute("maxpay", bEditBPayInput.value);
      bAdd.value = name;
      bAdd.style.marginRight = "0";
      bAdd.style.width ="auto";
      blocks.appendChild(bAdd);
      bAdd.style.border = "1px solid #7a3c8a";
      bAdd.style.borderRadius = "3px";
      bAdd.style.fontSize = "12px";
      bAdd.style.padding = "5px 10px 5px 10px";
      bAdd.style.display = "inline-block";
      bAdd.style.color = "#FFFFFF";
      bAdd.style.backgroundColor = "#9D4DB1";
      bAdd.style.backgroundImage = "-webkit-linear-gradient(top, #9D4DB1, #5E2E6A)";
      bAdd.style.margin = "5px";
      bEditModal.style.display = "none";

      bAdd.onclick = function() {
        selectedBlock = this;
        editBlock(this);
        bEditModal.style.display = "block";
      }

      closeBEditModal.onclick = function() {
        bEditModal.style.display = "none";
      }
    }
    else if (
      match !== null &&
      match !== '' &&
      name !== null &&
      name !== '' &&
      name.toLowerCase() !== button.value.toLowerCase() &&
      bNameSearch(name) == true
    ) {
      alert('Please choose a unique name for this block.')
    }
  }

  var addBlock = document.createElement("input");
  addBlock.type = "button";
  addBlock.value = "Add Block";
  bListBot.appendChild(addBlock);
  addBlock.style.float = 'right';
  addBlock.style.width ="100px";
  addBlock.style.border = "1px solid #544293";
  addBlock.style.borderRadius = "3px";
  addBlock.style.fontSize = "12px";
  addBlock.style.padding = "5px 10px 5px 10px";
  addBlock.style.margin = "5px";
  addBlock.style.display = "inline-block";
  addBlock.style.color = "#FFFFFF";
  addBlock.style.backgroundColor = "#6D59B4";
  addBlock.style.backgroundImage = "-webkit-linear-gradient(top, #6D59B4, #48358C)";

  addBlock.onclick = function() {
    bAddMatchInput.value = '';
    bAddNameInput.value = '';
    bAddBAllMenu.value == 'Yes';
    bAddBPayOptions.style.opacity = '0.25';
    bAddBPayInput.disabled = true;
    bAddBPayInput.value = '1.00';
    bAddModal.style.display = "block";
  }

  async function blockImport() {
    var blockImport = prompt('Paste your block list here. This will replace your current block list ' +
                             'and you may need to refresh for the changes to show.');
    if (blockImport !== null && blockImport !== '') {
      GM_setValue("blockList", blockImport);
      blockList = blockImport;
      await scrapAllBlockButtons();
      populateBlockButtons();
    }
  }

  var importBlocks = document.createElement("input");
  importBlocks.type = "button";
  importBlocks.value = "Import";
  bListBot.appendChild(importBlocks);
  importBlocks.style.width ="70px";
  importBlocks.style.border = "1px solid #544293";
  importBlocks.style.borderRadius = "3px";
  importBlocks.style.fontSize = "12px";
  importBlocks.style.padding = "5px 10px 5px 10px";
  importBlocks.style.margin = "5px";
  importBlocks.style.display = "inline-block";
  importBlocks.style.color = "#FFFFFF";
  importBlocks.style.backgroundColor = "#6D59B4";
  importBlocks.style.backgroundImage = "-webkit-linear-gradient(top, #6D59B4, #48358C)";
  importBlocks.addEventListener("click", blockImport, false);

  function blockExport() {
    GM_setClipboard(GM_getValue('blockList'));
    alert('Your block list has been copied to the clipboard');
  }

  var exportBlocks = document.createElement("input");
  exportBlocks.type = "button";
  exportBlocks.value = "Export";
  bListBot.appendChild(exportBlocks);
  exportBlocks.style.width ="70px";
  exportBlocks.style.border = "1px solid #544293";
  exportBlocks.style.borderRadius = "3px";
  exportBlocks.style.fontSize = "12px";
  exportBlocks.style.padding = "5px 10px 5px 10px";
  exportBlocks.style.margin = "5px";
  exportBlocks.style.display = "inline-block";
  exportBlocks.style.color = "#FFFFFF";
  exportBlocks.style.backgroundColor = "#6D59B4";
  exportBlocks.style.backgroundImage = "-webkit-linear-gradient(top, #6D59B4, #48358C)";
  exportBlocks.addEventListener("click", blockExport, false);

  var bAddTop = document.createElement('div');
  bAddWindow.appendChild(bAddTop);
  bAddTop.style.height = '24px';

  var bAddLabel = document.createElement('span');
  bAddTop.appendChild(bAddLabel);
  bAddLabel.innerHTML = 'Add Block';
  bAddLabel.style.fontSize = '20px';
  bAddLabel.style.marginLeft = '6px';
  bAddLabel.style.marginTop = '18px';
  bAddLabel.style.fontWeight = 'bold';

  var bAddClose = document.querySelector("#bAddModal > div > span");
  bAddTop.appendChild(bAddClose);
  bAddClose.type = "button";
  bAddClose.style.float = 'right';
  bAddClose.style.lineHeight = '1.5rem';
  bAddClose.style.textAlign = 'center';
  bAddClose.style.opacity = "0.9";
  bAddClose.style.cursor = 'pointer';
  bAddClose.innerHTML = "<i class='fa fa-times'></i>";
  bAddClose.style.backgroundColor = "#6D59B4";
  bAddClose.style.border = "1px solid #544293";
  bAddClose.style.backgroundImage = "-webkit-linear-gradient(top, #6D59B4, #48358C)";
  bAddClose.style.color = "#FFFFFF";
  bAddClose.style.fontSize = '14px'
  bAddClose.style.fontWeight = "bold";
  bAddClose.style.borderRadius = "3px";
  bAddClose.style.width ="23px";
  bAddClose.style.padding ="0px 5px 0px 5px";
  bAddClose.style.margin = "4px";

  var bAddTopDivide = document.createElement('hr');
  bAddWindow.appendChild(bAddTopDivide);
  bAddTopDivide.style.backgroundColor = '#333333';
  bAddTopDivide.style.align = 'center';
  bAddTopDivide.style.height = '1px';
  bAddTopDivide.style.width = '330px';
  bAddTopDivide.style.margin = '13px 0px 12px 3px';

  var bAddInfo = document.createElement('div');
  bAddWindow.appendChild(bAddInfo);
  bAddInfo.style.minHeight = '115px';

  var bAddMatchOptions = document.createElement('div');
  bAddInfo.appendChild(bAddMatchOptions);
  bAddMatchOptions.style.margin = '7px 0px 12px 0px';

  var bAddMatchLabel = document.createElement('span');
  bAddMatchOptions.appendChild(bAddMatchLabel);
  bAddMatchLabel.innerHTML = 'Match:';
  bAddMatchLabel.style.fontSize = '14px';
  bAddMatchLabel.style.fontWeight = 'bold';
  bAddMatchLabel.style.color = "lightgrey";
  bAddMatchLabel.style.margin = '6px 0px 6px 6px';

  var bAddMatchInput = document.createElement("input");
  bAddMatchInput.title = 'Enter a requester ID, group ID, or text string that you would like to block.';
  bAddMatchInput.style.float = 'right';
  bAddMatchInput.style.width = '250px';
  bAddMatchInput.style.border = "1px solid #544293";
  bAddMatchInput.style.borderRadius = '3px';
  bAddMatchInput.style.fontSize = '12px';
  bAddMatchInput.style.padding = '2px 0px 2px 10px';
  bAddMatchInput.style.marginRight = '6px';
  bAddMatchInput.style.color = '#FFFFFF';
  bAddMatchInput.style.backgroundColor = "#6D59B4";
  bAddMatchInput.style.backgroundImage = "-webkit-linear-gradient(top, #6D59B4, #48358C)";
  bAddMatchOptions.appendChild(bAddMatchInput);

  var bAddNameOptions = document.createElement('div');
  bAddInfo.appendChild(bAddNameOptions);
  bAddNameOptions.style.margin = '12px 0px 12px 0px';

  var bAddNameLabel = document.createElement('span');
  bAddNameOptions.appendChild(bAddNameLabel);
  bAddNameLabel.innerHTML = 'Name:';
  bAddNameLabel.style.fontSize = '14px';
  bAddNameLabel.style.fontWeight = 'bold';
  bAddNameLabel.style.color = "lightgrey";
  bAddNameLabel.style.margin = '12px 0px 12px 6px';

  var bAddNameInput = document.createElement("input");
  bAddNameInput.title = 'Enter a name for this block. This name is only used for identification and will not ' +
    'be used in searches.';
  bAddNameInput.style.float = 'right';
  bAddNameInput.style.width = '250px';
  bAddNameInput.style.border = "1px solid #544293";
  bAddNameInput.style.borderRadius = '3px';
  bAddNameInput.style.padding = '2px 0px 2px 10px';
  bAddNameInput.style.marginRight = '6px';
  bAddNameInput.style.color = '#FFFFFF';
  bAddNameInput.style.backgroundColor = "#6D59B4";
  bAddNameInput.style.backgroundImage = "-webkit-linear-gradient(top, #6D59B4, #48358C)";
  bAddNameOptions.appendChild(bAddNameInput);

  var bAddBAllOptions = document.createElement('div');
  bAddInfo.appendChild(bAddBAllOptions);
  bAddBAllOptions.style.margin = '12px 0px 12px 0px';

  var bAddBAllLabel = document.createElement('span');
  bAddBAllOptions.appendChild(bAddBAllLabel);
  bAddBAllLabel.innerHTML = 'Block all:';
  bAddBAllLabel.style.fontSize = '14px';
  bAddBAllLabel.style.fontWeight = 'bold';
  bAddBAllLabel.style.color = "lightgrey";
  bAddBAllLabel.style.margin = '12px 0px 12px 6px';

  var bAddBAllMenu = document.createElement("select");
  bAddBAllMenu.title = 'Block all matches regardless of pay'
  bAddBAllMenu.value = "Block all";
  bAddBAllMenu.style.float = 'right';
  bAddBAllMenu.style.width = '120px';
  bAddBAllMenu.style.border = "1px solid #544293";
  bAddBAllMenu.style.borderRadius = '3px';
  bAddBAllMenu.style.padding = '2px 0px 2px 6px';
  bAddBAllMenu.style.marginRight = '6px';
  bAddBAllMenu.style.color = '#FFFFFF';
  bAddBAllMenu.style.backgroundColor = "#6D59B4";
  bAddBAllMenu.style.backgroundImage = "-webkit-linear-gradient(top, #6D59B4, #48358C)";
  bAddBAllOptions.appendChild(bAddBAllMenu);
  var bAddBAllOptYes = document.createElement("option");
  bAddBAllOptYes.value = 'Yes';
  bAddBAllOptYes.text = 'Yes';
  bAddBAllOptYes.style.fontWeight = "bold";
  bAddBAllMenu.add(bAddBAllOptYes);
  var bAddBAllOptNo = document.createElement("option");
  bAddBAllOptNo.value = 'No';
  bAddBAllOptNo.text = 'No';
  bAddBAllOptNo.style.fontWeight = "bold";
  bAddBAllMenu.add(bAddBAllOptNo);
  bAddBAllMenu.addEventListener(
    'change',
    function() {
      if (bAddBAllMenu.value == 'No') {
        bAddBPayOptions.style.opacity = '1';
        bAddBPayInput.disabled = false;
      }
      if (bAddBAllMenu.value == 'Yes') {
        bAddBPayOptions.style.opacity = '0.25';
        bAddBPayInput.disabled = true;
      }
    }, false);


  var bAddBPayOptions = document.createElement('div');
  bAddInfo.appendChild(bAddBPayOptions);
  bAddBPayOptions.style.margin = '12px 0px 12px 0px';
  bAddBPayOptions.style.opacity = '0.25';

  var bAddBPayLabel = document.createElement('span');
  bAddBPayOptions.appendChild(bAddBPayLabel);
  bAddBPayLabel.innerHTML = 'Block below pay (dollars):';
  bAddBPayLabel.style.fontSize = '14px';
  bAddBPayLabel.style.fontWeight = 'bold';
  bAddBPayLabel.style.color = "lightgrey";
  bAddBPayLabel.style.margin = '12px 0px 12px 6px';

  var bAddBPayInput = document.createElement('input');
  bAddBPayInput.setAttribute("type", "number");
  bAddBPayInput.innerHTML =
    '<style>' +
    'input[type=number]::-webkit-outer-spin-button,' +
    'input[type=number]::-webkit-inner-spin-button {' +
    '-webkit-appearance: inner-spin-button !important;' +
    '}' +
    '</style>'
  bAddBPayInput.title = 'Block all matches below this amount';
  bAddBPayInput.setAttribute('disabled', true);
  bAddBPayInput.value = '1.00';
  bAddBPayInput.step = '0.01';
  bAddBPayInput.min = '0.01';
  bAddBPayInput.max = '999.99';
  bAddBPayInput.style.float = 'right';
  bAddBPayInput.style.width = '120px';
  bAddBPayInput.style.border = "1px solid #544293";
  bAddBPayInput.style.borderRadius = '3px';
  bAddBPayInput.style.padding = '2px 0px 2px 6px';
  bAddBPayInput.style.marginRight = '6px';
  bAddBPayInput.style.color = '#FFFFFF';
  bAddBPayInput.style.backgroundColor = "#6D59B4";
  bAddBPayInput.style.backgroundImage = "-webkit-linear-gradient(top, #6D59B4, #48358C)";
  bAddBPayOptions.appendChild(bAddBPayInput);

  var bAddBotDivide = document.createElement('hr');
  bAddWindow.appendChild(bAddBotDivide);
  bAddBotDivide.style.backgroundColor = '#333333';
  bAddBotDivide.style.align = 'center';
  bAddBotDivide.style.height = '1px';
  bAddBotDivide.style.width = '330px';
  bAddBotDivide.style.margin = '14px 0px 6px 3px';

  var bAddBot = document.createElement('div');
  bAddWindow.appendChild(bAddBot);
  bAddBot.style.margin = '0px 4px 0px 2px';

  var bAddSave = document.createElement("input");
  bAddSave.type = "button";
  bAddSave.value = "Save";
  bAddBot.appendChild(bAddSave);
  bAddSave.style.float = 'right';
  bAddSave.style.width ="80px";
  bAddSave.style.border = "1px solid #544293";
  bAddSave.style.borderRadius = "3px";
  bAddSave.style.fontSize = "12px";
  bAddSave.style.padding = "5px 10px 5px 10px";
  bAddSave.style.margin = "5px";
  bAddSave.style.display = "inline-block";
  bAddSave.style.color = "#FFFFFF";
  bAddSave.style.backgroundColor = "#6D59B4";
  bAddSave.style.backgroundImage = "-webkit-linear-gradient(top, #6D59B4, #48358C)";
  bAddSave.addEventListener("click", addNewBlock, false);

  var bEditTop = document.createElement('div');
  bEditWindow.appendChild(bEditTop);
  bEditTop.style.height = '24px';

  var bEditLabel = document.createElement('span');
  bEditTop.appendChild(bEditLabel);
  bEditLabel.innerHTML = 'Edit Block';
  bEditLabel.style.fontSize = '20px';
  bEditLabel.style.marginLeft = '6px';
  bEditLabel.style.marginTop = '18px';
  bEditLabel.style.fontWeight = 'bold';

  var bEditClose = document.querySelector("#bEditModal > div > span");
  bEditTop.appendChild(bEditClose);
  bEditClose.type = "button";
  bEditClose.style.float = 'right';
  bEditClose.style.lineHeight = '1.5rem';
  bEditClose.style.textAlign = 'center';
  bEditClose.style.opacity = "0.9";
  bEditClose.style.cursor = 'pointer';
  bEditClose.innerHTML = "<i class='fa fa-times'></i>";
  bEditClose.style.backgroundColor = "#6D59B4";
  bEditClose.style.border = "1px solid #544293";
  bEditClose.style.backgroundImage = "-webkit-linear-gradient(top, #6D59B4, #48358C)";
  bEditClose.style.color = "#FFFFFF";
  bEditClose.style.fontSize = '14px'
  bEditClose.style.fontWeight = "bold";
  bEditClose.style.borderRadius = "3px";
  bEditClose.style.width ="23px";
  bEditClose.style.padding ="0px 5px 0px 5px";
  bEditClose.style.margin = "4px";

  var bEditTopDivide = document.createElement('hr');
  bEditWindow.appendChild(bEditTopDivide);
  bEditTopDivide.style.backgroundColor = '#333333';
  bEditTopDivide.style.align = 'center';
  bEditTopDivide.style.height = '1px';
  bEditTopDivide.style.width = '330px';
  bEditTopDivide.style.margin = '13px 0px 12px 3px';

  var bEditInfo = document.createElement('div');
  bEditWindow.appendChild(bEditInfo);
  bEditInfo.style.minHeight = '115px';

  var bEditMatchOptions = document.createElement('div');
  bEditInfo.appendChild(bEditMatchOptions);
  bEditMatchOptions.style.margin = '7px 0px 12px 0px';

  var bEditMatchLabel = document.createElement('span');
  bEditMatchOptions.appendChild(bEditMatchLabel);
  bEditMatchLabel.innerHTML = 'Match:';
  bEditMatchLabel.style.fontSize = '14px';
  bEditMatchLabel.style.fontWeight = 'bold';
  bEditMatchLabel.style.color = "lightgrey";
  bEditMatchLabel.style.margin = '6px 0px 6px 6px';

  var bEditMatchInput = document.createElement("input");
  bEditMatchInput.title = 'Enter a requester ID, group ID, or text string that you would like ' +
    'to block.';
  bEditMatchInput.style.float = 'right';
  bEditMatchInput.style.width = '250px';
  bEditMatchInput.style.border = "1px solid #544293";
  bEditMatchInput.style.borderRadius = '3px';
  bEditMatchInput.style.fontSize = '12px';
  bEditMatchInput.style.padding = '2px 0px 2px 10px';
  bEditMatchInput.style.marginRight = '6px';
  bEditMatchInput.style.color = '#FFFFFF';
  bEditMatchInput.style.backgroundColor = "#6D59B4";
  bEditMatchInput.style.backgroundImage = "-webkit-linear-gradient(top, #6D59B4, #48358C)";
  bEditMatchOptions.appendChild(bEditMatchInput);

  var bEditNameOptions = document.createElement('div');
  bEditInfo.appendChild(bEditNameOptions);
  bEditNameOptions.style.margin = '12px 0px 12px 0px';

  var bEditNameLabel = document.createElement('span');
  bEditNameOptions.appendChild(bEditNameLabel);
  bEditNameLabel.innerHTML = 'Name:';
  bEditNameLabel.style.fontSize = '14px';
  bEditNameLabel.style.fontWeight = 'bold';
  bEditNameLabel.style.color = "lightgrey";
  bEditNameLabel.style.margin = '12px 0px 12px 6px';

  var bEditNameInput = document.createElement("input");
  bEditNameInput.title = 'Enter a name for this block. This name is only used for identification ' +
    'and will not be used in searches.';
  bEditNameInput.style.float = 'right';
  bEditNameInput.style.width = '250px';
  bEditNameInput.style.border = "1px solid #544293";
  bEditNameInput.style.borderRadius = '3px';
  bEditNameInput.style.padding = '2px 0px 2px 10px';
  bEditNameInput.style.marginRight = '6px';
  bEditNameInput.style.color = '#FFFFFF';
  bEditNameInput.style.backgroundColor = "#6D59B4";
  bEditNameInput.style.backgroundImage = "-webkit-linear-gradient(top, #6D59B4, #48358C)";
  bEditNameOptions.appendChild(bEditNameInput);

  var bEditBAllOptions = document.createElement('div');
  bEditInfo.appendChild(bEditBAllOptions);
  bEditBAllOptions.style.margin = '12px 0px 12px 0px';

  var bEditBAllLabel = document.createElement('span');
  bEditBAllOptions.appendChild(bEditBAllLabel);
  bEditBAllLabel.innerHTML = 'Block all:';
  bEditBAllLabel.style.fontSize = '14px';
  bEditBAllLabel.style.fontWeight = 'bold';
  bEditBAllLabel.style.color = "lightgrey";
  bEditBAllLabel.style.margin = '12px 0px 12px 6px';

  var bEditBAllMenu = document.createElement("select");
  bEditBAllMenu.title = 'Block all matches regardless of pay'
  bEditBAllMenu.value = "Block all";
  bEditBAllMenu.style.float = 'right';
  bEditBAllMenu.style.width = '120px';
  bEditBAllMenu.style.border = "1px solid #544293";
  bEditBAllMenu.style.borderRadius = '3px';
  bEditBAllMenu.style.padding = '2px 0px 2px 6px';
  bEditBAllMenu.style.marginRight = '6px';
  bEditBAllMenu.style.color = '#FFFFFF';
  bEditBAllMenu.style.backgroundColor = "#6D59B4";
  bEditBAllMenu.style.backgroundImage = "-webkit-linear-gradient(top, #6D59B4, #48358C)";
  bEditBAllOptions.appendChild(bEditBAllMenu);
  var bEditBAllOptYes = document.createElement("option");
  bEditBAllOptYes.value = 'Yes';
  bEditBAllOptYes.text = 'Yes';
  bEditBAllOptYes.style.fontWeight = "bold";
  bEditBAllMenu.add(bEditBAllOptYes);
  var bEditBAllOptNo = document.createElement("option");
  bEditBAllOptNo.value = 'No';
  bEditBAllOptNo.text = 'No';
  bEditBAllOptNo.style.fontWeight = "bold";
  bEditBAllMenu.add(bEditBAllOptNo);
  bEditBAllMenu.addEventListener(
    'change',
    function() {
      if (bEditBAllMenu.value == 'No') {
        bEditBPayOptions.style.opacity = '1';
        bEditBPayInput.disabled = false;
      }
      if (bEditBAllMenu.value == 'Yes') {
        bEditBPayOptions.style.opacity = '0.25';
        bEditBPayInput.disabled = true;
      }
    }, false);


  var bEditBPayOptions = document.createElement('div');
  bEditInfo.appendChild(bEditBPayOptions);
  bEditBPayOptions.style.margin = '12px 0px 12px 0px';
  bEditBPayOptions.style.opacity = '0.25';

  var bEditBPayLabel = document.createElement('span');
  bEditBPayOptions.appendChild(bEditBPayLabel);
  bEditBPayLabel.innerHTML = 'Block below pay (dollars):';
  bEditBPayLabel.style.fontSize = '14px';
  bEditBPayLabel.style.fontWeight = 'bold';
  bEditBPayLabel.style.color = "lightgrey";
  bEditBPayLabel.style.margin = '12px 0px 12px 6px';

  var bEditBPayInput = document.createElement('input');
  bEditBPayInput.setAttribute("type", "number");
  bEditBPayInput.innerHTML =
    '<style>' +
    'input[type=number]::-webkit-outer-spin-button,' +
    'input[type=number]::-webkit-inner-spin-button {' +
    '-webkit-appearance: inner-spin-button !important;' +
    '}' +
    '</style>'
  bEditBPayInput.title = 'Block all matches below this amount';
  bEditBPayInput.setAttribute('disabled', true);
  bEditBPayInput.value = '1.00';
  bEditBPayInput.step = '0.01';
  bEditBPayInput.min = '0.01';
  bEditBPayInput.max = '999.99';
  bEditBPayInput.style.float = 'right';
  bEditBPayInput.style.width = '120px';
  bEditBPayInput.style.border = "1px solid #544293";
  bEditBPayInput.style.borderRadius = '3px';
  bEditBPayInput.style.padding = '2px 0px 2px 6px';
  bEditBPayInput.style.marginRight = '6px';
  bEditBPayInput.style.color = '#FFFFFF';
  bEditBPayInput.style.backgroundColor = "#6D59B4";
  bEditBPayInput.style.backgroundImage = "-webkit-linear-gradient(top, #6D59B4, #48358C)";
  bEditBPayOptions.appendChild(bEditBPayInput);

  var bEditBotDivide = document.createElement('hr');
  bEditWindow.appendChild(bEditBotDivide);
  bEditBotDivide.style.backgroundColor = '#333333';
  bEditBotDivide.style.align = 'center';
  bEditBotDivide.style.height = '1px';
  bEditBotDivide.style.width = '330px';
  bEditBotDivide.style.margin = '14px 0px 6px 3px';

  var bEditBot = document.createElement('div');
  bEditWindow.appendChild(bEditBot);
  bEditBot.style.margin = '0px 4px 0px 2px';

  var bEditSave = document.createElement("input");
  bEditSave.type = "button";
  bEditSave.value = "Save";
  bEditBot.appendChild(bEditSave);
  bEditSave.style.float = 'right';
  bEditSave.style.width ="80px";
  bEditSave.style.border = "1px solid #544293";
  bEditSave.style.borderRadius = "3px";
  bEditSave.style.fontSize = "12px";
  bEditSave.style.padding = "5px 10px 5px 10px";
  bEditSave.style.margin = "5px";
  bEditSave.style.display = "inline-block";
  bEditSave.style.color = "#FFFFFF";
  bEditSave.style.backgroundColor = "#6D59B4";
  bEditSave.style.backgroundImage = "-webkit-linear-gradient(top, #6D59B4, #48358C)";
  bEditSave.onclick = function() {
    updateBlock(selectedBlock)
  }

  var bEditDelete = document.createElement("input");
  bEditDelete.type = "button";
  bEditDelete.value = "Delete";
  bEditBot.appendChild(bEditDelete);
  bEditDelete.style.float = 'right';
  bEditDelete.style.width ="80px";
  bEditDelete.style.border = "1px solid #7a3c8a";
  bEditDelete.style.borderRadius = "3px";
  bEditDelete.style.fontSize = "12px";
  bEditDelete.style.padding = "5px 10px 5px 10px";
  bEditDelete.style.margin = "5px";
  bEditDelete.style.display = "inline-block";
  bEditDelete.style.color = "#FFFFFF";
  bEditDelete.style.backgroundColor = "#9D4DB1";
  bEditDelete.style.backgroundImage = "-webkit-linear-gradient(top, #9D4DB1, #5E2E6A)";
  bEditDelete.onclick = function() {
    scrapBlock(selectedBlock);
  }

  var iListTop = document.createElement('div');
  iListWindow.appendChild(iListTop);
  iListTop.style.height = '24px';

  var includeLabel = document.createElement('span');
  iListTop.appendChild(includeLabel);
  includeLabel.innerHTML = 'Include List';
  includeLabel.style.fontSize = '20px';
  includeLabel.style.marginLeft = '6px';
  includeLabel.style.marginTop = '18px';
  includeLabel.style.fontWeight = 'bold';

  var iListClose = document.querySelector("#iModal > div > span");
  iListTop.appendChild(iListClose);
  iListClose.type = "button";
  iListClose.style.float = 'right';
  iListClose.style.lineHeight = '1.5rem';
  iListClose.style.textAlign = 'center';
  iListClose.style.opacity = "0.9";
  iListClose.style.cursor = 'pointer';
  iListClose.innerHTML = "<i class='fa fa-times'></i>";
  iListClose.style.backgroundColor = "#6D59B4";
  iListClose.style.border = "1px solid #544293";
  iListClose.style.backgroundImage = "-webkit-linear-gradient(top, #6D59B4, #48358C)";
  iListClose.style.color = "#FFFFFF";
  iListClose.style.fontSize = '14px'
  iListClose.style.fontWeight = "bold";
  iListClose.style.borderRadius = "3px";
  iListClose.style.width ="23px";
  iListClose.style.padding ="0px 5px 0px 5px";
  iListClose.style.margin = "4px";

  var iListTopDivide = document.createElement('hr');
  iListWindow.appendChild(iListTopDivide);
  iListTopDivide.style.backgroundColor = '#333333';
  iListTopDivide.style.align = 'center';
  iListTopDivide.style.height = '1px';
  iListTopDivide.style.width = '420px';
  iListTopDivide.style.margin = '13px 0px 6px 3px';

  var includes = document.createElement('div');
  iListWindow.appendChild(includes);
  includes.style.height = 'auto';
  includes.style.minHeight = '320px';

  function scrapInclude(button) {
    var i = 0;
    for (i = 0; i < includeList.length; i++) {
      if (includeList[i][0].trim() === button.value.trim()) {
        includeList.splice(i, 1);
        GM_setValue("includeList", JSON.stringify(includeList));
        button.remove();
      }
    }
    iEditModal.style.display = "none";
  }

  var iName = includeList.sort(([a], [b]) => a.toLowerCase().localeCompare(b.toLowerCase()));

  var selectedInclude;
  function populateIncludeButtons() {
    var i = 0;
    for (i = 0; i < includeList.length; i++) {
      var iAdd = document.createElement("input");
      iAdd.type = "button";
      iAdd.setAttribute("class","iButton");
      iAdd.setAttribute("title", iName[i][1]);
      iAdd.setAttribute("includeall", iName[i][2]);
      iAdd.setAttribute("minpay", iName[i][3]);
      iAdd.setAttribute("minavail", iName[i][4]);
      iAdd.setAttribute("panda", iName[i][5]);
      iAdd.setAttribute("focus", iName[i][6]);
      iAdd.setAttribute("limit", iName[i][7]);
      iAdd.setAttribute("queue", iName[i][8]);
      iAdd.value = iName[i][0];
      iAdd.style.marginRight = "0";
      iAdd.style.width ="auto";
      includes.appendChild(iAdd);
      iAdd.style.border = "1px solid #36658c";
      iAdd.style.borderRadius = "3px";
      iAdd.style.fontSize = "12px";
      iAdd.style.padding = "5px 10px 5px 10px";
      iAdd.style.textDecoration = "none";
      iAdd.style.display = "inline-block";
      iAdd.style.color = "#FFFFFF";
      iAdd.style.backgroundColor = "#4682B4";
      iAdd.style.backgroundImage = "-webkit-linear-gradient(top, #4682B4, #1D517B)";
      iAdd.style.margin = "5px";

      iAdd.onclick = function() {
        selectedInclude = this;
        editInclude(this);
        iEditModal.style.display = "block";
      }

      closeIEditModal.onclick = function() {
        iEditModal.style.display = "none";
      }
    }
  }
  populateIncludeButtons();

  function editInclude(button) {
    iEditMatchInput.value = button.title;
    iEditNameInput.value = button.value;
    iEditIAllMenu.value = button.getAttribute('includeall');
    iEditIPayInput.value = button.getAttribute('minpay');
    iEditAvailInput.value = button.getAttribute('minavail');
    iEditPandaMenu.value = button.getAttribute('panda');
    iEditFocusMenu.value = button.getAttribute('focus');
    iEditLimitInput.value = button.getAttribute('limit');
    iEditQueueInput.value = button.getAttribute('queue');
    if (button.getAttribute('includeall') == 'No') {
      iEditIPayOptions.style.opacity = '1';
      iEditAvailOptions.style.opacity = '1';
      iEditIPayInput.disabled = false;
      iEditAvailInput.disabled = false;
    }
    if (button.getAttribute('includeall') == 'Yes') {
      iEditIPayOptions.style.opacity = '0.25';
      iEditAvailOptions.style.opacity = '0.25';
      iEditIPayInput.disabled = true;
      iEditAvailInput.disabled = true;
    }
    if (button.getAttribute('panda') == 'No') {
      iEditFocusOptions.style.opacity = '0.25';
      iEditFocusMenu.disabled = true;
      iEditLimitOptions.style.opacity = '0.25';
      iEditLimitInput.disabled = true;
      iEditQueueOptions.style.opacity = '0.25';
      iEditQueueInput.disabled = true;
    }
    if (button.getAttribute('panda') == 'One') {
      iEditFocusOptions.style.opacity = '1';
      iEditFocusMenu.disabled = false;
      iEditLimitOptions.style.opacity = '1';
      iEditLimitInput.disabled = false;
      iEditQueueOptions.style.opacity = '0.25';
      iEditQueueInput.disabled = true;
    }
    if (button.getAttribute('panda') == 'Many') {
      iEditFocusOptions.style.opacity = '1';
      iEditFocusMenu.disabled = false;
      iEditLimitOptions.style.opacity = '1';
      iEditLimitInput.disabled = false;
      iEditQueueOptions.style.opacity = '1';
      iEditQueueInput.disabled = false;
    }
  }

  var iButtons = document.getElementsByClassName('iButton');

  function scrapAllIncludeButtons() {
    var i = 0;
    for (i = 0; i < includeList.length; i++) {
      iButtons[i].remove();
      i--;
    }
  }

  var iListBotDivide = document.createElement('hr');
  iListWindow.appendChild(iListBotDivide);
  iListBotDivide.style.backgroundColor = '#333333';
  iListBotDivide.style.align = 'center';
  iListBotDivide.style.height = '1px';
  iListBotDivide.style.width = '420px';
  iListBotDivide.style.margin = '6px 0px 6px 3px';

  var iListBot = document.createElement('div');
  iListWindow.appendChild(iListBot);
  iListBot.style.margin = '0px 4px 0px 2px';

  function iNameSearch(name) {
    var nameLogged = false;
    var i = 0;
    for (i = 0; i < includeList.length; i++) {
      if (includeList[i][0].toLowerCase().trim() === name.toLowerCase().trim()) {
        nameLogged = true;
      }
    }
    return nameLogged;
  }

  function addNewInclude() {
    var match = iAddMatchInput.value;
    if (match.includes('worker.mturk.com/projects/')) {
      match = match.split('projects/')[1].split('/tasks')[0];
    }
    var name = iAddNameInput.value;
    var includeAll = iAddIAllMenu.value;
    var minIPay = iAddIPayInput.value;
    var minIAvail = iAddAvailInput.value;
    var iPanda = iAddPandaMenu.value;
    var iFocus = iAddFocusMenu.value
    var iLimit = iAddLimitInput.value
    var iQueue = iAddQueueInput.value
    if (name !== null && name !== '' && iNameSearch(name) !== true) {
      includeList.push([name, match, includeAll, minIPay, minIAvail, iPanda, iFocus, iLimit, iQueue]);
      GM_setValue("includeList", JSON.stringify(includeList));
      var iAdd = document.createElement("input");
      iAdd.type = "button";
      iAdd.setAttribute("class","iButton");
      iAdd.setAttribute("title", match);
      iAdd.setAttribute("includeall", includeAll);
      iAdd.setAttribute("minpay", minIPay);
      iAdd.setAttribute("minavail", minIAvail);
      iAdd.setAttribute("panda", iPanda);
      iAdd.setAttribute("focus", iFocus);
      iAdd.setAttribute("limit", iLimit);
      iAdd.setAttribute("queue", iQueue);
      iAdd.value = name;
      iAdd.style.marginRight = "0";
      iAdd.style.width ="auto";
      includes.appendChild(iAdd);
      iAdd.style.border = "1px solid #36658c";
      iAdd.style.borderRadius = "3px";
      iAdd.style.fontSize = "12px";
      iAdd.style.padding = "5px 10px 5px 10px";
      iAdd.style.display = "inline-block";
      iAdd.style.color = "#FFFFFF";
      iAdd.style.backgroundColor = "#4682B4";
      iAdd.style.backgroundImage = "-webkit-linear-gradient(top, #4682B4, #1D517B)";
      iAdd.style.margin = "5px";
      iAddModal.style.display = "none";

      iAdd.onclick = function() {
        selectedInclude = this;
        editInclude(this);
        iEditModal.style.display = "block";
      }

      closeIAddModal.onclick = function() {
        iAddModal.style.display = "none";
      }
    }
    else if (name !== null && name !== '' && iNameSearch(name) == true) {
      alert('Please choose a unique name for this include.')
    } else {
      iAddModal.style.display = "none";
    }
  }

  async function updateInclude(button) {
    var match = iEditMatchInput.value;
    if (match.includes('worker.mturk.com/projects/')) {
      match = match.split('projects/')[1].split('/tasks')[0];
    }
    var name = iEditNameInput.value;
    var includeAll = iEditIAllMenu.value;
    var minIPay = iEditIPayInput.value;
    var minIAvail = iEditAvailInput.value;
    var iPanda = iEditPandaMenu.value;
    var iFocus = iEditFocusMenu.value
    var iLimit = iEditLimitInput.value
    var iQueue = iEditQueueInput.value
    if (
      name !== null &&
      name !== '' &&
      (iNameSearch(name) !== true ||
       name.toLowerCase() == button.value.toLowerCase())
    ) {
      await scrapInclude(button);
      includeList.push([name, match, includeAll, minIPay, minIAvail, iPanda, iFocus, iLimit, iQueue]);
      GM_setValue("includeList", JSON.stringify(includeList));
      var iAdd = document.createElement("input");
      iAdd.type = "button";
      iAdd.setAttribute("class","iButton");
      iAdd.setAttribute("title", match);
      iAdd.setAttribute("includeall", includeAll);
      iAdd.setAttribute("minpay", minIPay);
      iAdd.setAttribute("minavail", minIAvail);
      iAdd.setAttribute("panda", iPanda);
      iAdd.setAttribute("focus", iFocus);
      iAdd.setAttribute("limit", iLimit);
      iAdd.setAttribute("queue", iQueue);
      iAdd.value = name;
      iAdd.style.marginRight = "0";
      iAdd.style.width ="auto";
      includes.appendChild(iAdd);
      iAdd.style.border = "1px solid #36658c";
      iAdd.style.borderRadius = "3px";
      iAdd.style.fontSize = "12px";
      iAdd.style.padding = "5px 10px 5px 10px";
      iAdd.style.display = "inline-block";
      iAdd.style.color = "#FFFFFF";
      iAdd.style.backgroundColor = "#4682B4";
      iAdd.style.backgroundImage = "-webkit-linear-gradient(top, #4682B4, #1D517B)";
      iAdd.style.margin = "5px";
      iEditModal.style.display = "none";

      iAdd.onclick = function() {
        selectedInclude = this;
        editInclude(this);
        iEditModal.style.display = "block";
      }

      closeIEditModal.onclick = function() {
        iEditModal.style.display = "none";
      }
    }
    else if (
      name !== null &&
      name !== '' &&
      name.toLowerCase() !== button.value.toLowerCase() &&
      iNameSearch(name) == true
    ) {
      alert('Please choose a unique name for this include.')
    }
  }

  var addInclude = document.createElement("input");
  addInclude.type = "button";
  addInclude.value = "Add Include";
  iListBot.appendChild(addInclude);
  addInclude.style.float = 'right';
  addInclude.style.width ="100px";
  addInclude.style.border = "1px solid #544293";
  addInclude.style.borderRadius = "3px";
  addInclude.style.fontSize = "12px";
  addInclude.style.padding = "5px 10px 5px 10px";
  addInclude.style.margin = "5px";
  addInclude.style.display = "inline-block";
  addInclude.style.color = "#FFFFFF";
  addInclude.style.backgroundColor = "#6D59B4";
  addInclude.style.backgroundImage = "-webkit-linear-gradient(top, #6D59B4, #48358C)";

  addInclude.onclick = function() {
    iAddMatchInput.value = '';
    iAddNameInput.value = '';
    iAddIAllMenu.value == 'Yes';
    iAddIPayOptions.style.opacity = '0.25';
    iAddAvailOptions.style.opacity = '0.25';
    iAddIPayInput.disabled = true;
    iAddAvailInput.disabled = true;
    iAddIPayInput.value = '1.00';
    iAddAvailInput.value = '0';
    iAddPandaMenu.value == 'No';
    iAddFocusOptions.style.opacity = '0.25';
    iAddFocusMenu.disabled = true;
    iAddQueueOptions.style.opacity = '0.25';
    iAddQueueInput.disabled = true;
    iAddQueueInput.value = '25';
    iAddLimitOptions.style.opacity = '0.25';
    iAddLimitInput.disabled = true;
    iAddLimitInput.value = '0';
    iAddFocusMenu.value = "No";
    iAddModal.style.display = "block";
  }

  async function includeImport() {
    var includeImport = prompt('Paste your include list here. This will replace your current ' +
                               'include list and you may need to refresh for the changes to show.');
    if (includeImport !== null && includeImport !== '') {
      GM_setValue("includeList", includeImport);
      includeList = includeImport;
      await scrapAllIncludeButtons();
      populateIncludeButtons();
    }
  }

  var importIncludes = document.createElement("input");
  importIncludes.type = "button";
  importIncludes.value = "Import";
  iListBot.appendChild(importIncludes);
  importIncludes.style.width ="70px";
  importIncludes.style.border = "1px solid #544293";
  importIncludes.style.borderRadius = "3px";
  importIncludes.style.fontSize = "12px";
  importIncludes.style.padding = "5px 10px 4px 10px";
  importIncludes.style.margin = "5px";
  importIncludes.style.display = "inline-block";
  importIncludes.style.color = "#FFFFFF";
  importIncludes.style.backgroundColor = "#6D59B4";
  importIncludes.style.backgroundImage = "-webkit-linear-gradient(top, #6D59B4, #48358C)";
  importIncludes.addEventListener("click", includeImport, false);

  function includeExport() {
    GM_setClipboard(GM_getValue('includeList'));
    alert('Your include list has been copied to the clipboard');
  }

  var exportIncludes = document.createElement("input");
  exportIncludes.type = "button";
  exportIncludes.value = "Export";
  iListBot.appendChild(exportIncludes);
  exportIncludes.style.width ="70px";
  exportIncludes.style.border = "1px solid #544293";
  exportIncludes.style.borderRadius = "3px";
  exportIncludes.style.fontSize = "12px";
  exportIncludes.style.padding = "5px 10px 5px 10px";
  exportIncludes.style.margin = "5px";
  exportIncludes.style.display = "inline-block";
  exportIncludes.style.color = "#FFFFFF";
  exportIncludes.style.backgroundColor = "#6D59B4";
  exportIncludes.style.backgroundImage = "-webkit-linear-gradient(top, #6D59B4, #48358C)";
  exportIncludes.addEventListener("click", includeExport, false);

  var iAddTop = document.createElement('div');
  iAddWindow.appendChild(iAddTop);
  iAddTop.style.height = '24px';

  var iAddLabel = document.createElement('span');
  iAddTop.appendChild(iAddLabel);
  iAddLabel.innerHTML = 'Add Include';
  iAddLabel.style.fontSize = '20px';
  iAddLabel.style.marginLeft = '6px';
  iAddLabel.style.marginTop = '18px';
  iAddLabel.style.fontWeight = 'bold';

  var iAddClose = document.querySelector("#iAddModal > div > span");
  iAddTop.appendChild(iAddClose);
  iAddClose.type = "button";
  iAddClose.style.float = 'right';
  iAddClose.style.lineHeight = '1.5rem';
  iAddClose.style.textAlign = 'center';
  iAddClose.style.opacity = "0.9";
  iAddClose.style.cursor = 'pointer';
  iAddClose.innerHTML = "<i class='fa fa-times'></i>";
  iAddClose.style.backgroundColor = "#6D59B4";
  iAddClose.style.border = "1px solid #544293";
  iAddClose.style.backgroundImage = "-webkit-linear-gradient(top, #6D59B4, #48358C)";
  iAddClose.style.color = "#FFFFFF";
  iAddClose.style.fontSize = '14px'
  iAddClose.style.fontWeight = "bold";
  iAddClose.style.borderRadius = "3px";
  iAddClose.style.width ="23px";
  iAddClose.style.padding ="0px 5px 0px 5px";
  iAddClose.style.margin = "4px";

  var iAddTopDivide = document.createElement('hr');
  iAddWindow.appendChild(iAddTopDivide);
  iAddTopDivide.style.backgroundColor = '#333333';
  iAddTopDivide.style.align = 'center';
  iAddTopDivide.style.height = '1px';
  iAddTopDivide.style.width = '330px';
  iAddTopDivide.style.margin = '13px 0px 12px 3px';

  var iAddInfo = document.createElement('div');
  iAddWindow.appendChild(iAddInfo);
  iAddInfo.style.minHeight = '235px';

  var iAddMatchOptions = document.createElement('div');
  iAddInfo.appendChild(iAddMatchOptions);
  iAddMatchOptions.style.margin = '7px 0px 12px 0px';

  var iAddMatchLabel = document.createElement('span');
  iAddMatchOptions.appendChild(iAddMatchLabel);
  iAddMatchLabel.innerHTML = 'Match:';
  iAddMatchLabel.style.fontSize = '14px';
  iAddMatchLabel.style.fontWeight = 'bold';
  iAddMatchLabel.style.color = "lightgrey";
  iAddMatchLabel.style.margin = '6px 0px 6px 6px';

  var iAddMatchInput = document.createElement("input");
  iAddMatchInput.title = 'Enter a requester ID, a group ID, or text string that you would like ' +
    'to include. The catcher will try to accept any HIT that matches ' +
    'regardless of TO or TV ratings. \n\nThe minimum pay for includes ' +
    'is determined by the minimum reward search filter in the settings.';
  iAddMatchInput.style.float = 'right';
  iAddMatchInput.style.width = '250px';
  iAddMatchInput.style.border = "1px solid #544293";
  iAddMatchInput.style.borderRadius = '3px';
  iAddMatchInput.style.fontSize = '12px';
  iAddMatchInput.style.padding = '2px 0px 2px 10px';
  iAddMatchInput.style.marginRight = '6px';
  iAddMatchInput.style.color = '#FFFFFF';
  iAddMatchInput.style.backgroundColor = "#6D59B4";
  iAddMatchInput.style.backgroundImage = "-webkit-linear-gradient(top, #6D59B4, #48358C)";
  iAddMatchOptions.appendChild(iAddMatchInput);

  var iAddNameOptions = document.createElement('div');
  iAddInfo.appendChild(iAddNameOptions);
  iAddNameOptions.style.margin = '12px 0px 12px 0px';

  var iAddNameLabel = document.createElement('span');
  iAddNameOptions.appendChild(iAddNameLabel);
  iAddNameLabel.innerHTML = 'Name:';
  iAddNameLabel.style.fontSize = '14px';
  iAddNameLabel.style.fontWeight = 'bold';
  iAddNameLabel.style.color = "lightgrey";
  iAddNameLabel.style.margin = '12px 0px 12px 6px';

  var iAddNameInput = document.createElement("input");
  iAddNameInput.title = 'Enter a name for this include. This name is only used for ' +
    'identification and will not be used in searches.';
  iAddNameInput.style.float = 'right';
  iAddNameInput.style.width = '250px';
  iAddNameInput.style.border = "1px solid #544293";
  iAddNameInput.style.borderRadius = '3px';
  iAddNameInput.style.fontSize = '12px';
  iAddNameInput.style.padding = '2px 0px 2px 10px';
  iAddNameInput.style.marginRight = '6px';
  iAddNameInput.style.color = '#FFFFFF';
  iAddNameInput.style.backgroundColor = "#6D59B4";
  iAddNameInput.style.backgroundImage = "-webkit-linear-gradient(top, #6D59B4, #48358C)";
  iAddNameOptions.appendChild(iAddNameInput);

  var iAddIAllOptions = document.createElement('div');
  iAddInfo.appendChild(iAddIAllOptions);
  iAddIAllOptions.style.margin = '12px 0px 12px 0px';

  var iAddIAllLabel = document.createElement('span');
  iAddIAllOptions.appendChild(iAddIAllLabel);
  iAddIAllLabel.innerHTML = 'Include all:';
  iAddIAllLabel.style.fontSize = '14px';
  iAddIAllLabel.style.fontWeight = 'bold';
  iAddIAllLabel.style.color = "lightgrey";
  iAddIAllLabel.style.margin = '12px 0px 12px 6px';

  var iAddIAllMenu = document.createElement("select");
  iAddIAllMenu.title = 'Include all matches regardless of pay'
  iAddIAllMenu.value = "Include all";
  iAddIAllMenu.style.float = 'right';
  iAddIAllMenu.style.width = '120px';
  iAddIAllMenu.style.border = "1px solid #544293";
  iAddIAllMenu.style.borderRadius = '3px';
  iAddIAllMenu.style.fontSize = '12px';
  iAddIAllMenu.style.padding = '2px 0px 2px 6px';
  iAddIAllMenu.style.marginRight = '6px';
  iAddIAllMenu.style.color = '#FFFFFF';
  iAddIAllMenu.style.backgroundColor = "#6D59B4";
  iAddIAllMenu.style.backgroundImage = "-webkit-linear-gradient(top, #6D59B4, #48358C)";
  iAddIAllOptions.appendChild(iAddIAllMenu);
  var iAddIAllOptYes = document.createElement("option");
  iAddIAllOptYes.value = 'Yes';
  iAddIAllOptYes.text = 'Yes';
  iAddIAllOptYes.style.fontWeight = "bold";
  iAddIAllMenu.add(iAddIAllOptYes);
  var iAddIAllOptNo = document.createElement("option");
  iAddIAllOptNo.value = 'No';
  iAddIAllOptNo.text = 'No';
  iAddIAllOptNo.style.fontWeight = "bold";
  iAddIAllMenu.add(iAddIAllOptNo);
  iAddIAllMenu.addEventListener(
    'change',
    function() {
      if (iAddIAllMenu.value == 'No') {
        iAddIPayOptions.style.opacity = '1';
        iAddAvailOptions.style.opacity = '1';
        iAddIPayInput.disabled = false;
        iAddAvailInput.disabled = false;
      }
      if (iAddIAllMenu.value == 'Yes') {
        iAddIPayOptions.style.opacity = '0.25';
        iAddAvailOptions.style.opacity = '0.25';
        iAddIPayInput.disabled = true;
        iAddAvailInput.disabled = true;
      }
    }, false);

  var iAddIPayOptions = document.createElement('div');
  iAddInfo.appendChild(iAddIPayOptions);
  iAddIPayOptions.style.margin = '12px 0px 12px 0px';
  iAddIPayOptions.style.opacity = '0.25';

  var iAddIPayLabel = document.createElement('span');
  iAddIPayOptions.appendChild(iAddIPayLabel);
  iAddIPayLabel.innerHTML = 'Minimum pay (dollars):';
  iAddIPayLabel.style.fontSize = '14px';
  iAddIPayLabel.style.fontWeight = 'bold';
  iAddIPayLabel.style.color = "lightgrey";
  iAddIPayLabel.style.margin = '12px 0px 12px 6px';

  var iAddIPayInput = document.createElement('input');
  iAddIPayInput.setAttribute("type", "number");
  iAddIPayInput.innerHTML =
    '<style>' +
    'input[type=number]::-webkit-outer-spin-button,' +
    'input[type=number]::-webkit-inner-spin-button {' +
    '-webkit-appearance: inner-spin-button !important;' +
    '}' +
    '</style>'
  iAddIPayInput.title = 'Include all matches above this amount';
  iAddIPayInput.value = '1.00';
  iAddIPayInput.step = '0.01';
  iAddIPayInput.min = '0.00';
  iAddIPayInput.max = '999.99';
  iAddIPayInput.setAttribute('disabled', true);
  iAddIPayInput.style.float = 'right';
  iAddIPayInput.style.width = '120px';
  iAddIPayInput.style.border = "1px solid #544293";
  iAddIPayInput.style.borderRadius = '3px';
  iAddIPayInput.style.fontSize = '12px';
  iAddIPayInput.style.padding = '2px 0px 2px 6px';
  iAddIPayInput.style.marginRight = '6px';
  iAddIPayInput.style.color = '#FFFFFF';
  iAddIPayInput.style.backgroundColor = "#6D59B4";
  iAddIPayInput.style.backgroundImage = "-webkit-linear-gradient(top, #6D59B4, #48358C)";
  iAddIPayOptions.appendChild(iAddIPayInput);

  var iAddAvailOptions = document.createElement('div');
  iAddInfo.appendChild(iAddAvailOptions);
  iAddAvailOptions.style.margin = '12px 0px 12px 0px';
  iAddAvailOptions.style.opacity = '0.25';

  var iAddAvailLabel = document.createElement('span');
  iAddAvailOptions.appendChild(iAddAvailLabel);
  iAddAvailLabel.innerHTML = 'Minimum available HITs:';
  iAddAvailLabel.style.fontSize = '14px';
  iAddAvailLabel.style.fontWeight = 'bold';
  iAddAvailLabel.style.color = "lightgrey";
  iAddAvailLabel.style.margin = '12px 0px 12px 6px';

  var iAddAvailInput = document.createElement('input');
  iAddAvailInput.setAttribute("type", "number");
  iAddAvailInput.innerHTML =
    '<style>' +
    'input[type=number]::-webkit-outer-spin-button,' +
    'input[type=number]::-webkit-inner-spin-button {' +
    '-webkit-appearance: inner-spin-button !important;' +
    '}' +
    '</style>'
  iAddAvailInput.title = 'Only grab HITs from batches with at least this many HITs available';
  iAddAvailInput.value = '0';
  iAddAvailInput.step = '1';
  iAddAvailInput.min = '0';
  iAddAvailInput.max = '99999';
  iAddAvailInput.setAttribute('disabled', true);
  iAddAvailInput.style.float = 'right';
  iAddAvailInput.style.width = '120px';
  iAddAvailInput.style.border = "1px solid #544293";
  iAddAvailInput.style.borderRadius = '3px';
  iAddAvailInput.style.fontSize = '12px';
  iAddAvailInput.style.padding = '2px 0px 2px 6px';
  iAddAvailInput.style.marginRight = '6px';
  iAddAvailInput.style.color = '#FFFFFF';
  iAddAvailInput.style.backgroundColor = "#6D59B4";
  iAddAvailInput.style.backgroundImage = "-webkit-linear-gradient(top, #6D59B4, #48358C)";
  iAddAvailOptions.appendChild(iAddAvailInput);

  var iAddPandaOptions = document.createElement('div');
  iAddInfo.appendChild(iAddPandaOptions);
  iAddPandaOptions.style.margin = '12px 0px 12px 0px';

  var iAddPandaLabel = document.createElement('span');
  iAddPandaOptions.appendChild(iAddPandaLabel);
  iAddPandaLabel.innerHTML = 'Start a panda:';
  iAddPandaLabel.style.fontSize = '14px';
  iAddPandaLabel.style.fontWeight = 'bold';
  iAddPandaLabel.style.color = "lightgrey";
  iAddPandaLabel.style.margin = '12px 0px 12px 6px';

  var iAddPandaMenu = document.createElement("select");
  iAddPandaMenu.title = 'Start a panda when a HIT matching this include is found.'
  iAddPandaMenu.value = "Start panda";
  iAddPandaMenu.style.float = 'right';
  iAddPandaMenu.style.width = '120px';
  iAddPandaMenu.style.border = "1px solid #544293";
  iAddPandaMenu.style.borderRadius = '3px';
  iAddPandaMenu.style.fontSize = '12px';
  iAddPandaMenu.style.padding = '2px 0px 2px 6px';
  iAddPandaMenu.style.marginRight = '6px';
  iAddPandaMenu.style.color = '#FFFFFF';
  iAddPandaMenu.style.backgroundColor = "#6D59B4";
  iAddPandaMenu.style.backgroundImage = "-webkit-linear-gradient(top, #6D59B4, #48358C)";
  iAddPandaOptions.appendChild(iAddPandaMenu);
  var iAddPandaOptNo = document.createElement("option");
  iAddPandaOptNo.value = 'No';
  iAddPandaOptNo.text = 'No';
  iAddPandaOptNo.style.fontWeight = "bold";
  iAddPandaMenu.add(iAddPandaOptNo);
  var iAddPandaOptOne = document.createElement("option");
  iAddPandaOptOne.value = 'One';
  iAddPandaOptOne.text = 'Panda one';
  iAddPandaOptOne.style.fontWeight = "bold";
  iAddPandaMenu.add(iAddPandaOptOne);
  var iAddPandaOptMany = document.createElement("option");
  iAddPandaOptMany.value = 'Many';
  iAddPandaOptMany.text = 'Panda many';
  iAddPandaOptMany.style.fontWeight = "bold";
  iAddPandaMenu.add(iAddPandaOptMany);
  iAddPandaMenu.addEventListener(
    'change',
    function() {
      if (iAddPandaMenu.value == 'No') {
        iAddFocusOptions.style.opacity = '0.25';
        iAddFocusMenu.disabled = true;
        iAddLimitOptions.style.opacity = '0.25';
        iAddLimitInput.disabled = true;
        iAddQueueOptions.style.opacity = '0.25';
        iAddQueueInput.disabled = true;
      } else if (iAddPandaMenu.value == 'One') {
        iAddFocusOptions.style.opacity = '1';
        iAddFocusMenu.disabled = false;
        iAddLimitOptions.style.opacity = '1';
        iAddLimitInput.disabled = false;
        iAddQueueOptions.style.opacity = '0.25';
        iAddQueueInput.disabled = true;
      } else {
        iAddFocusOptions.style.opacity = '1';
        iAddFocusMenu.disabled = false;
        iAddLimitOptions.style.opacity = '1';
        iAddLimitInput.disabled = false;
        iAddQueueOptions.style.opacity = '1';
        iAddQueueInput.disabled = false;
      }
    }, false);

  var iAddQueueOptions = document.createElement('div');
  iAddInfo.appendChild(iAddQueueOptions);
  iAddQueueOptions.style.margin = '12px 0px 12px 0px';
  iAddQueueOptions.style.opacity = '0.25';

  var iAddQueueLabel = document.createElement('span');
  iAddQueueOptions.appendChild(iAddQueueLabel);
  iAddQueueLabel.innerHTML = 'Queue limit:';
  iAddQueueLabel.style.fontSize = '14px';
  iAddQueueLabel.style.fontWeight = 'bold';
  iAddQueueLabel.style.color = "lightgrey";
  iAddQueueLabel.style.margin = '12px 0px 12px 6px';

  var iAddQueueInput = document.createElement('input');
  iAddQueueInput.setAttribute("type", "number");
  iAddQueueInput.innerHTML =
    '<style>' +
    'input[type=number]::-webkit-outer-spin-button,' +
    'input[type=number]::-webkit-inner-spin-button {' +
    '-webkit-appearance: inner-spin-button !important;' +
    '}' +
    '</style>'
  iAddQueueInput.title = 'Maximum number of HITs with this ID to keep in queue';
  iAddQueueInput.disabled = 'true';
  iAddQueueInput.value = '25';
  iAddQueueInput.step = '1';
  iAddQueueInput.min = '1';
  iAddQueueInput.max = '25';
  iAddQueueInput.style.float = 'right';
  iAddQueueInput.style.width = '120px';
  iAddQueueInput.style.border = "1px solid #544293";
  iAddQueueInput.style.borderRadius = '3px';
  iAddQueueInput.style.fontSize = '12px';
  iAddQueueInput.style.padding = '2px 0px 2px 6px';
  iAddQueueInput.style.marginRight = '6px';
  iAddQueueInput.style.color = '#FFFFFF';
  iAddQueueInput.style.backgroundColor = "#6D59B4";
  iAddQueueInput.style.backgroundImage = "-webkit-linear-gradient(top, #6D59B4, #48358C)";
  iAddQueueOptions.appendChild(iAddQueueInput);

  var iAddLimitOptions = document.createElement('div');
  iAddInfo.appendChild(iAddLimitOptions);
  iAddLimitOptions.style.margin = '12px 0px 12px 0px';
  iAddLimitOptions.style.opacity = '0.25';

  var iAddLimitLabel = document.createElement('span');
  iAddLimitOptions.appendChild(iAddLimitLabel);
  iAddLimitLabel.innerHTML = 'Search limit (0 for unlimited):';
  iAddLimitLabel.style.fontSize = '14px';
  iAddLimitLabel.style.fontWeight = 'bold';
  iAddLimitLabel.style.color = "lightgrey";
  iAddLimitLabel.style.margin = '12px 0px 12px 6px';

  var iAddLimitInput = document.createElement('input');
  iAddLimitInput.setAttribute("type", "number");
  iAddLimitInput.innerHTML =
    '<style>' +
    'input[type=number]::-webkit-outer-spin-button,' +
    'input[type=number]::-webkit-inner-spin-button {' +
    '-webkit-appearance: inner-spin-button !important;' +
    '}' +
    '</style>'
  iAddLimitInput.title = 'Automatically disable the panda after it has searched this many times (0 for no limit)';
  iAddLimitInput.value = '0';
  iAddLimitInput.step = '1';
  iAddLimitInput.min = '0';
  iAddLimitInput.max = '99999';
  iAddLimitInput.setAttribute('disabled', true);
  iAddLimitInput.style.float = 'right';
  iAddLimitInput.style.width = '120px';
  iAddLimitInput.style.border = "1px solid #544293";
  iAddLimitInput.style.borderRadius = '3px';
  iAddLimitInput.style.fontSize = '12px';
  iAddLimitInput.style.padding = '2px 0px 2px 6px';
  iAddLimitInput.style.marginRight = '6px';
  iAddLimitInput.style.color = '#FFFFFF';
  iAddLimitInput.style.backgroundColor = "#6D59B4";
  iAddLimitInput.style.backgroundImage = "-webkit-linear-gradient(top, #6D59B4, #48358C)";
  iAddLimitOptions.appendChild(iAddLimitInput);

  var iAddFocusOptions = document.createElement('div');
  iAddInfo.appendChild(iAddFocusOptions);
  iAddFocusOptions.style.margin = '12px 0px 12px 0px';
  iAddFocusOptions.style.opacity = '0.25';

  var iAddFocusLabel = document.createElement('span');
  iAddFocusOptions.appendChild(iAddFocusLabel);
  iAddFocusLabel.innerHTML = 'Focus panda:';
  iAddFocusLabel.style.fontSize = '14px';
  iAddFocusLabel.style.fontWeight = 'bold';
  iAddFocusLabel.style.color = "lightgrey";
  iAddFocusLabel.style.margin = '12px 0px 12px 6px';

  var iAddFocusMenu = document.createElement("select");
  iAddFocusMenu.title = 'Disables the scanner before running this panda'
  iAddFocusMenu.value = "Focus panda";
  iAddFocusMenu.setAttribute('disabled', true);
  iAddFocusMenu.style.float = 'right';
  iAddFocusMenu.style.width = '120px';
  iAddFocusMenu.style.border = "1px solid #544293";
  iAddFocusMenu.style.borderRadius = '3px';
  iAddFocusMenu.style.fontSize = '12px';
  iAddFocusMenu.style.padding = '2px 0px 2px 6px';
  iAddFocusMenu.style.marginRight = '6px';
  iAddFocusMenu.style.color = '#FFFFFF';
  iAddFocusMenu.style.backgroundColor = "#6D59B4";
  iAddFocusMenu.style.backgroundImage = "-webkit-linear-gradient(top, #6D59B4, #48358C)";
  iAddFocusOptions.appendChild(iAddFocusMenu);
  var iAddFocusOptNo = document.createElement("option");
  iAddFocusOptNo.value = 'No';
  iAddFocusOptNo.text = 'No';
  iAddFocusOptNo.style.fontWeight = "bold";
  iAddFocusMenu.add(iAddFocusOptNo);
  var iAddFocusOptYes = document.createElement("option");
  iAddFocusOptYes.value = 'Yes';
  iAddFocusOptYes.text = 'Yes';
  iAddFocusOptYes.style.fontWeight = "bold";
  iAddFocusMenu.add(iAddFocusOptYes);

  var iAddBotDivide = document.createElement('hr');
  iAddWindow.appendChild(iAddBotDivide);
  iAddBotDivide.style.backgroundColor = '#333333';
  iAddBotDivide.style.align = 'center';
  iAddBotDivide.style.height = '1px';
  iAddBotDivide.style.width = '330px';
  iAddBotDivide.style.margin = '14px 0px 6px 3px';

  var iAddBot = document.createElement('div');
  iAddWindow.appendChild(iAddBot);
  iAddBot.style.margin = '0px 4px 0px 2px';

  var iAddSave = document.createElement("input");
  iAddSave.type = "button";
  iAddSave.value = "Save";
  iAddBot.appendChild(iAddSave);
  iAddSave.style.float = 'right';
  iAddSave.style.width ="80px";
  iAddSave.style.border = "1px solid #544293";
  iAddSave.style.borderRadius = "3px";
  iAddSave.style.fontSize = "12px";
  iAddSave.style.padding = "5px 10px 5px 10px";
  iAddSave.style.margin = "5px";
  iAddSave.style.display = "inline-block";
  iAddSave.style.color = "#FFFFFF";
  iAddSave.style.backgroundColor = "#6D59B4";
  iAddSave.style.backgroundImage = "-webkit-linear-gradient(top, #6D59B4, #48358C)";
  iAddSave.addEventListener("click", addNewInclude, false);

  var iEditTop = document.createElement('div');
  iEditWindow.appendChild(iEditTop);
  iEditTop.style.height = '24px';

  var iEditLabel = document.createElement('span');
  iEditTop.appendChild(iEditLabel);
  iEditLabel.innerHTML = 'Edit Include';
  iEditLabel.style.fontSize = '20px';
  iEditLabel.style.marginLeft = '6px';
  iEditLabel.style.marginTop = '18px';
  iEditLabel.style.fontWeight = 'bold';

  var iEditClose = document.querySelector("#iEditModal > div > span");
  iEditTop.appendChild(iEditClose);
  iEditClose.type = "button";
  iEditClose.style.float = 'right';
  iEditClose.style.lineHeight = '1.5rem';
  iEditClose.style.textAlign = 'center';
  iEditClose.style.opacity = "0.9";
  iEditClose.style.cursor = 'pointer';
  iEditClose.innerHTML = "<i class='fa fa-times'></i>";
  iEditClose.style.backgroundColor = "#6D59B4";
  iEditClose.style.border = "1px solid #544293";
  iEditClose.style.backgroundImage = "-webkit-linear-gradient(top, #6D59B4, #48358C)";
  iEditClose.style.color = "#FFFFFF";
  iEditClose.style.fontSize = '14px'
  iEditClose.style.fontWeight = "bold";
  iEditClose.style.borderRadius = "3px";
  iEditClose.style.width ="23px";
  iEditClose.style.padding ="0px 5px 0px 5px";
  iEditClose.style.margin = "4px";

  var iEditTopDivide = document.createElement('hr');
  iEditWindow.appendChild(iEditTopDivide);
  iEditTopDivide.style.backgroundColor = '#333333';
  iEditTopDivide.style.align = 'center';
  iEditTopDivide.style.height = '1px';
  iEditTopDivide.style.width = '330px';
  iEditTopDivide.style.margin = '13px 0px 12px 3px';

  var iEditInfo = document.createElement('div');
  iEditWindow.appendChild(iEditInfo);
  iEditInfo.style.minHeight = '205px';

  var iEditMatchOptions = document.createElement('div');
  iEditInfo.appendChild(iEditMatchOptions);
  iEditMatchOptions.style.margin = '7px 0px 12px 0px';

  var iEditMatchLabel = document.createElement('span');
  iEditMatchOptions.appendChild(iEditMatchLabel);
  iEditMatchLabel.innerHTML = 'Match:';
  iEditMatchLabel.style.fontSize = '14px';
  iEditMatchLabel.style.fontWeight = 'bold';
  iEditMatchLabel.style.color = "lightgrey";
  iEditMatchLabel.style.margin = '6px 0px 6px 6px';

  var iEditMatchInput = document.createElement("input");
  iEditMatchInput.title = 'Enter a requester ID, a group ID, or text string that you would like ' +
    ' to include. The catcher will try to accept any HIT that matches ' +
    'regardless of TO or TV ratings.\n\nThe minimum pay for includes is ' +
    'determined by the minimum reward search filter in the settings.';
  iEditMatchInput.style.float = 'right';
  iEditMatchInput.style.width = '250px';
  iEditMatchInput.style.border = "1px solid #544293";
  iEditMatchInput.style.borderRadius = '3px';
  iEditMatchInput.style.fontSize = '12px';
  iEditMatchInput.style.padding = '2px 0px 2px 10px';
  iEditMatchInput.style.marginRight = '6px';
  iEditMatchInput.style.color = '#FFFFFF';
  iEditMatchInput.style.backgroundColor = "#6D59B4";
  iEditMatchInput.style.backgroundImage = "-webkit-linear-gradient(top, #6D59B4, #48358C)";
  iEditMatchOptions.appendChild(iEditMatchInput);

  var iEditNameOptions = document.createElement('div');
  iEditInfo.appendChild(iEditNameOptions);
  iEditNameOptions.style.margin = '12px 0px 12px 0px';

  var iEditNameLabel = document.createElement('span');
  iEditNameOptions.appendChild(iEditNameLabel);
  iEditNameLabel.innerHTML = 'Name:';
  iEditNameLabel.style.fontSize = '14px';
  iEditNameLabel.style.fontWeight = 'bold';
  iEditNameLabel.style.color = "lightgrey";
  iEditNameLabel.style.margin = '12px 0px 12px 6px';

  var iEditNameInput = document.createElement("input");
  iEditNameInput.title = 'Enter a name for this include. This name is only used for ' +
    'identification and will not be used in searches.';
  iEditNameInput.style.float = 'right';
  iEditNameInput.style.width = '250px';
  iEditNameInput.style.border = "1px solid #544293";
  iEditNameInput.style.borderRadius = '3px';
  iEditNameInput.style.fontSize = '12px';
  iEditNameInput.style.padding = '2px 0px 2px 10px';
  iEditNameInput.style.marginRight = '6px';
  iEditNameInput.style.color = '#FFFFFF';
  iEditNameInput.style.backgroundColor = "#6D59B4";
  iEditNameInput.style.backgroundImage = "-webkit-linear-gradient(top, #6D59B4, #48358C)";
  iEditNameOptions.appendChild(iEditNameInput);

  var iEditIAllOptions = document.createElement('div');
  iEditInfo.appendChild(iEditIAllOptions);
  iEditIAllOptions.style.margin = '12px 0px 12px 0px';

  var iEditIAllLabel = document.createElement('span');
  iEditIAllOptions.appendChild(iEditIAllLabel);
  iEditIAllLabel.innerHTML = 'Include all:';
  iEditIAllLabel.style.fontSize = '14px';
  iEditIAllLabel.style.fontWeight = 'bold';
  iEditIAllLabel.style.color = "lightgrey";
  iEditIAllLabel.style.margin = '12px 0px 12px 6px';

  var iEditIAllMenu = document.createElement("select");
  iEditIAllMenu.title = 'Include all matches regardless of pay'
  iEditIAllMenu.value = "Include all";
  iEditIAllMenu.style.float = 'right';
  iEditIAllMenu.style.width = '120px';
  iEditIAllMenu.style.border = "1px solid #544293";
  iEditIAllMenu.style.borderRadius = '3px';
  iEditIAllMenu.style.fontSize = '12px';
  iEditIAllMenu.style.padding = '2px 0px 2px 6px';
  iEditIAllMenu.style.marginRight = '6px';
  iEditIAllMenu.style.color = '#FFFFFF';
  iEditIAllMenu.style.backgroundColor = "#6D59B4";
  iEditIAllMenu.style.backgroundImage = "-webkit-linear-gradient(top, #6D59B4, #48358C)";
  iEditIAllOptions.appendChild(iEditIAllMenu);
  var iEditIAllOptYes = document.createElement("option");
  iEditIAllOptYes.value = 'Yes';
  iEditIAllOptYes.text = 'Yes';
  iEditIAllOptYes.style.fontWeight = "bold";
  iEditIAllMenu.add(iEditIAllOptYes);
  var iEditIAllOptNo = document.createElement("option");
  iEditIAllOptNo.value = 'No';
  iEditIAllOptNo.text = 'No';
  iEditIAllOptNo.style.fontWeight = "bold";
  iEditIAllMenu.add(iEditIAllOptNo);
  iEditIAllMenu.addEventListener(
    'change',
    function() {
      if (iEditIAllMenu.value == 'No') {
        iEditIPayOptions.style.opacity = '1';
        iEditAvailOptions.style.opacity = '1';
        iEditIPayInput.disabled = false;
        iEditAvailInput.disabled = false;
      }
      if (iEditIAllMenu.value == 'Yes') {
        iEditIPayOptions.style.opacity = '0.25';
        iEditAvailOptions.style.opacity = '0.25';
        iEditIPayInput.disabled = true;
        iEditAvailInput.disabled = true;
      }
    }, false);

  var iEditIPayOptions = document.createElement('div');
  iEditInfo.appendChild(iEditIPayOptions);
  iEditIPayOptions.style.margin = '12px 0px 12px 0px';
  iEditIPayOptions.style.opacity = '0.25';

  var iEditIPayLabel = document.createElement('span');
  iEditIPayOptions.appendChild(iEditIPayLabel);
  iEditIPayLabel.innerHTML = 'Minimum pay (dollars):';
  iEditIPayLabel.style.fontSize = '14px';
  iEditIPayLabel.style.fontWeight = 'bold';
  iEditIPayLabel.style.color = "lightgrey";
  iEditIPayLabel.style.margin = '12px 0px 12px 6px';

  var iEditIPayInput = document.createElement('input');
  iEditIPayInput.setAttribute("type", "number");
  iEditIPayInput.innerHTML =
    '<style>' +
    'input[type=number]::-webkit-outer-spin-button,' +
    'input[type=number]::-webkit-inner-spin-button {' +
    '-webkit-appearance: inner-spin-button !important;' +
    '}' +
    '</style>'
  iEditIPayInput.title = 'Include all matches above this amount';
  iEditIPayInput.value = '1.00';
  iEditIPayInput.step = '0.01';
  iEditIPayInput.min = '0.00';
  iEditIPayInput.max = '999.99';
  iEditIPayInput.setAttribute('disabled', true);
  iEditIPayInput.style.float = 'right';
  iEditIPayInput.style.width = '120px';
  iEditIPayInput.style.border = "1px solid #544293";
  iEditIPayInput.style.borderRadius = '3px';
  iEditIPayInput.style.fontSize = '12px';
  iEditIPayInput.style.padding = '2px 0px 2px 6px';
  iEditIPayInput.style.marginRight = '6px';
  iEditIPayInput.style.color = '#FFFFFF';
  iEditIPayInput.style.backgroundColor = "#6D59B4";
  iEditIPayInput.style.backgroundImage = "-webkit-linear-gradient(top, #6D59B4, #48358C)";
  iEditIPayOptions.appendChild(iEditIPayInput);

  var iEditAvailOptions = document.createElement('div');
  iEditInfo.appendChild(iEditAvailOptions);
  iEditAvailOptions.style.margin = '12px 0px 12px 0px';
  iEditAvailOptions.style.opacity = '0.25';

  var iEditAvailLabel = document.createElement('span');
  iEditAvailOptions.appendChild(iEditAvailLabel);
  iEditAvailLabel.innerHTML = 'Minimum available HITs:';
  iEditAvailLabel.style.fontSize = '14px';
  iEditAvailLabel.style.fontWeight = 'bold';
  iEditAvailLabel.style.color = "lightgrey";
  iEditAvailLabel.style.margin = '12px 0px 12px 6px';

  var iEditAvailInput = document.createElement('input');
  iEditAvailInput.setAttribute("type", "number");
  iEditAvailInput.innerHTML =
    '<style>' +
    'input[type=number]::-webkit-outer-spin-button,' +
    'input[type=number]::-webkit-inner-spin-button {' +
    '-webkit-appearance: inner-spin-button !important;' +
    '}' +
    '</style>'
  iEditAvailInput.title = 'Only grab HITs from batches with at least this many HITs available';
  iEditAvailInput.value = '0';
  iEditAvailInput.step = '1';
  iEditAvailInput.min = '0';
  iEditAvailInput.max = '99999';
  iEditAvailInput.setAttribute('disabled', true);
  iEditAvailInput.style.float = 'right';
  iEditAvailInput.style.width = '120px';
  iEditAvailInput.style.border = "1px solid #544293";
  iEditAvailInput.style.borderRadius = '3px';
  iEditAvailInput.style.fontSize = '12px';
  iEditAvailInput.style.padding = '2px 0px 2px 6px';
  iEditAvailInput.style.marginRight = '6px';
  iEditAvailInput.style.color = '#FFFFFF';
  iEditAvailInput.style.backgroundColor = "#6D59B4";
  iEditAvailInput.style.backgroundImage = "-webkit-linear-gradient(top, #6D59B4, #48358C)";
  iEditAvailOptions.appendChild(iEditAvailInput);

  var iEditPandaOptions = document.createElement('div');
  iEditInfo.appendChild(iEditPandaOptions);
  iEditPandaOptions.style.margin = '12px 0px 12px 0px';

  var iEditPandaLabel = document.createElement('span');
  iEditPandaOptions.appendChild(iEditPandaLabel);
  iEditPandaLabel.innerHTML = 'Start a panda:';
  iEditPandaLabel.style.fontSize = '14px';
  iEditPandaLabel.style.fontWeight = 'bold';
  iEditPandaLabel.style.color = "lightgrey";
  iEditPandaLabel.style.margin = '12px 0px 12px 6px';

  var iEditPandaMenu = document.createElement("select");
  iEditPandaMenu.title = 'Start a panda when a HIT matching this include is found.'
  iEditPandaMenu.value = "Start panda";
  iEditPandaMenu.style.float = 'right';
  iEditPandaMenu.style.width = '120px';
  iEditPandaMenu.style.border = "1px solid #544293";
  iEditPandaMenu.style.borderRadius = '3px';
  iEditPandaMenu.style.fontSize = '12px';
  iEditPandaMenu.style.padding = '2px 0px 2px 6px';
  iEditPandaMenu.style.marginRight = '6px';
  iEditPandaMenu.style.color = '#FFFFFF';
  iEditPandaMenu.style.backgroundColor = "#6D59B4";
  iEditPandaMenu.style.backgroundImage = "-webkit-linear-gradient(top, #6D59B4, #48358C)";
  iEditPandaOptions.appendChild(iEditPandaMenu);
  var iEditPandaOptNo = document.createElement("option");
  iEditPandaOptNo.value = 'No';
  iEditPandaOptNo.text = 'No';
  iEditPandaOptNo.style.fontWeight = "bold";
  iEditPandaMenu.add(iEditPandaOptNo);
  var iEditPandaOptOne = document.createElement("option");
  iEditPandaOptOne.value = 'One';
  iEditPandaOptOne.text = 'Panda one';
  iEditPandaOptOne.style.fontWeight = "bold";
  iEditPandaMenu.add(iEditPandaOptOne);
  var iEditPandaOptMany = document.createElement("option");
  iEditPandaOptMany.value = 'Many';
  iEditPandaOptMany.text = 'Panda many';
  iEditPandaOptMany.style.fontWeight = "bold";
  iEditPandaMenu.add(iEditPandaOptMany);
  iEditPandaMenu.addEventListener(
    'change',
    function() {
      if (iEditPandaMenu.value == 'No') {
        iEditFocusOptions.style.opacity = '0.25';
        iEditFocusMenu.disabled = true;
        iEditLimitOptions.style.opacity = '0.25';
        iEditLimitInput.disabled = true;
        iEditQueueOptions.style.opacity = '0.25';
        iEditQueueInput.disabled = true;
      } else if (iEditPandaMenu.value == 'One') {
        iEditFocusOptions.style.opacity = '1';
        iEditFocusMenu.disabled = false;
        iEditLimitOptions.style.opacity = '1';
        iEditLimitInput.disabled = false;
        iEditQueueOptions.style.opacity = '0.25';
        iEditQueueInput.disabled = true;
      } else {
        iEditFocusOptions.style.opacity = '1';
        iEditFocusMenu.disabled = false;
        iEditLimitOptions.style.opacity = '1';
        iEditLimitInput.disabled = false;
        iEditQueueOptions.style.opacity = '1';
        iEditQueueInput.disabled = false;
      }
    }, false);

  var iEditQueueOptions = document.createElement('div');
  iEditInfo.appendChild(iEditQueueOptions);
  iEditQueueOptions.style.margin = '12px 0px 12px 0px';
  iEditQueueOptions.style.opacity = '0.25';

  var iEditQueueLabel = document.createElement('span');
  iEditQueueOptions.appendChild(iEditQueueLabel);
  iEditQueueLabel.innerHTML = 'Queue limit:';
  iEditQueueLabel.style.fontSize = '14px';
  iEditQueueLabel.style.fontWeight = 'bold';
  iEditQueueLabel.style.color = "lightgrey";
  iEditQueueLabel.style.margin = '12px 0px 12px 6px';

  var iEditQueueInput = document.createElement('input');
  iEditQueueInput.setAttribute("type", "number");
  iEditQueueInput.innerHTML =
    '<style>' +
    'input[type=number]::-webkit-outer-spin-button,' +
    'input[type=number]::-webkit-inner-spin-button {' +
    '-webkit-appearance: inner-spin-button !important;' +
    '}' +
    '</style>'
  iEditQueueInput.title = 'Maximum number of HITs with this ID to keep in queue';
  iEditQueueInput.disabled = 'true';
  iEditQueueInput.value = '25';
  iEditQueueInput.step = '1';
  iEditQueueInput.min = '1';
  iEditQueueInput.max = '25';
  iEditQueueInput.style.float = 'right';
  iEditQueueInput.style.width = '120px';
  iEditQueueInput.style.border = "1px solid #544293";
  iEditQueueInput.style.borderRadius = '3px';
  iEditQueueInput.style.fontSize = '12px';
  iEditQueueInput.style.padding = '2px 0px 2px 6px';
  iEditQueueInput.style.marginRight = '6px';
  iEditQueueInput.style.color = '#FFFFFF';
  iEditQueueInput.style.backgroundColor = "#6D59B4";
  iEditQueueInput.style.backgroundImage = "-webkit-linear-gradient(top, #6D59B4, #48358C)";
  iEditQueueOptions.appendChild(iEditQueueInput);

  var iEditLimitOptions = document.createElement('div');
  iEditInfo.appendChild(iEditLimitOptions);
  iEditLimitOptions.style.margin = '12px 0px 12px 0px';
  iEditLimitOptions.style.opacity = '0.25';

  var iEditLimitLabel = document.createElement('span');
  iEditLimitOptions.appendChild(iEditLimitLabel);
  iEditLimitLabel.innerHTML = 'Search limit (0 for unlimited):';
  iEditLimitLabel.style.fontSize = '14px';
  iEditLimitLabel.style.fontWeight = 'bold';
  iEditLimitLabel.style.color = "lightgrey";
  iEditLimitLabel.style.margin = '12px 0px 12px 6px';

  var iEditLimitInput = document.createElement('input');
  iEditLimitInput.setAttribute("type", "number");
  iEditLimitInput.innerHTML =
    '<style>' +
    'input[type=number]::-webkit-outer-spin-button,' +
    'input[type=number]::-webkit-inner-spin-button {' +
    '-webkit-appearance: inner-spin-button !important;' +
    '}' +
    '</style>'
  iEditLimitInput.title = 'Automatically disable the panda after it has searched ' +
    'this many times (0 for no limit)';
  iEditLimitInput.value = '0';
  iEditLimitInput.step = '1';
  iEditLimitInput.min = '0';
  iEditLimitInput.max = '99999';
  iEditLimitInput.setAttribute('disabled', true);
  iEditLimitInput.style.float = 'right';
  iEditLimitInput.style.width = '120px';
  iEditLimitInput.style.border = "1px solid #544293";
  iEditLimitInput.style.borderRadius = '3px';
  iEditLimitInput.style.fontSize = '12px';
  iEditLimitInput.style.padding = '2px 0px 2px 6px';
  iEditLimitInput.style.marginRight = '6px';
  iEditLimitInput.style.color = '#FFFFFF';
  iEditLimitInput.style.backgroundColor = "#6D59B4";
  iEditLimitInput.style.backgroundImage = "-webkit-linear-gradient(top, #6D59B4, #48358C)";
  iEditLimitOptions.appendChild(iEditLimitInput);

  var iEditFocusOptions = document.createElement('div');
  iEditInfo.appendChild(iEditFocusOptions);
  iEditFocusOptions.style.margin = '12px 0px 12px 0px';
  iEditFocusOptions.style.opacity = '0.25';

  var iEditFocusLabel = document.createElement('span');
  iEditFocusOptions.appendChild(iEditFocusLabel);
  iEditFocusLabel.innerHTML = 'Focus panda:';
  iEditFocusLabel.style.fontSize = '14px';
  iEditFocusLabel.style.fontWeight = 'bold';
  iEditFocusLabel.style.color = "lightgrey";
  iEditFocusLabel.style.margin = '12px 0px 12px 6px';

  var iEditFocusMenu = document.createElement("select");
  iEditFocusMenu.title = 'Disables the scanner before running this panda';
  iEditFocusMenu.value = "Focus panda";
  iEditFocusMenu.setAttribute('disabled', true);
  iEditFocusMenu.style.float = 'right';
  iEditFocusMenu.style.width = '120px';
  iEditFocusMenu.style.border = "1px solid #544293";
  iEditFocusMenu.style.borderRadius = '3px';
  iEditFocusMenu.style.fontSize = '12px';
  iEditFocusMenu.style.padding = '2px 0px 2px 6px';
  iEditFocusMenu.style.marginRight = '6px';
  iEditFocusMenu.style.color = '#FFFFFF';
  iEditFocusMenu.style.backgroundColor = "#6D59B4";
  iEditFocusMenu.style.backgroundImage = "-webkit-linear-gradient(top, #6D59B4, #48358C)";
  iEditFocusOptions.appendChild(iEditFocusMenu);
  var iEditFocusOptNo = document.createElement("option");
  iEditFocusOptNo.value = 'No';
  iEditFocusOptNo.text = 'No';
  iEditFocusOptNo.style.fontWeight = "bold";
  iEditFocusMenu.add(iEditFocusOptNo);
  var iEditFocusOptYes = document.createElement("option");
  iEditFocusOptYes.value = 'Yes';
  iEditFocusOptYes.text = 'Yes';
  iEditFocusOptYes.style.fontWeight = "bold";
  iEditFocusMenu.add(iEditFocusOptYes);

  var iEditBotDivide = document.createElement('hr');
  iEditWindow.appendChild(iEditBotDivide);
  iEditBotDivide.style.backgroundColor = '#333333';
  iEditBotDivide.style.align = 'center';
  iEditBotDivide.style.height = '1px';
  iEditBotDivide.style.width = '330px';
  iEditBotDivide.style.margin = '14px 0px 6px 3px';

  var iEditBot = document.createElement('div');
  iEditWindow.appendChild(iEditBot);
  iEditBot.style.margin = '0px 4px 0px 2px';

  var iEditSave = document.createElement("input");
  iEditSave.type = "button";
  iEditSave.value = "Save";
  iEditBot.appendChild(iEditSave);
  iEditSave.style.float = 'right';
  iEditSave.style.width ="80px";
  iEditSave.style.border = "1px solid #544293";
  iEditSave.style.borderRadius = "3px";
  iEditSave.style.fontSize = "12px";
  iEditSave.style.padding = "5px 10px 5px 10px";
  iEditSave.style.margin = "5px";
  iEditSave.style.display = "inline-block";
  iEditSave.style.color = "#FFFFFF";
  iEditSave.style.backgroundColor = "#6D59B4";
  iEditSave.style.backgroundImage = "-webkit-linear-gradient(top, #6D59B4, #48358C)";
  iEditSave.onclick = function() {
    updateInclude(selectedInclude)
  }

  var iEditDelete = document.createElement("input");
  iEditDelete.type = "button";
  iEditDelete.value = "Delete";
  iEditBot.appendChild(iEditDelete);
  iEditDelete.style.float = 'right';
  iEditDelete.style.width ="80px";
  iEditDelete.style.border = "1px solid #7a3c8a";
  iEditDelete.style.borderRadius = "3px";
  iEditDelete.style.fontSize = "12px";
  iEditDelete.style.padding = "5px 10px 5px 10px";
  iEditDelete.style.margin = "5px";
  iEditDelete.style.display = "inline-block";
  iEditDelete.style.color = "#FFFFFF";
  iEditDelete.style.backgroundColor = "#9D4DB1";
  iEditDelete.style.backgroundImage = "-webkit-linear-gradient(top, #9D4DB1, #5E2E6A)";
  iEditDelete.onclick = function() {
    scrapInclude(selectedInclude);
  }

  var logTop = document.createElement('div');
  logWindow.appendChild(logTop);

  var logLabel = document.createElement('span');
  logTop.appendChild(logLabel);
  logLabel.innerHTML = 'HIT Log';
  logLabel.style.fontSize = '20px';
  logLabel.style.marginLeft = '6px';
  logLabel.style.marginTop = '18px';
  logLabel.style.fontWeight = 'bold';

  function logClear() {
    logs.innerHTML = "";
    catchLog = [];
  }

  var logClose = document.querySelector("#lModal > div > span");
  logTop.appendChild(logClose);
  logClose.type = "button";
  logClose.style.float = 'right';
  logClose.style.lineHeight = '1.5rem';
  logClose.style.textAlign = 'center';
  logClose.style.opacity = "0.9";
  logClose.style.cursor = 'pointer';
  logClose.innerHTML = "<i class='fa fa-times'></i>";
  logClose.style.backgroundColor = "#6D59B4";
  logClose.style.border = "1px solid #544293";
  logClose.style.backgroundImage = "-webkit-linear-gradient(top, #6D59B4, #48358C)";
  logClose.style.color = "#FFFFFF";
  logClose.style.fontSize = '14px'
  logClose.style.fontWeight = "bold";
  logClose.style.borderRadius = "3px";
  logClose.style.width ="23px";
  logClose.style.padding ="0px 5px 0px 5px";
  logClose.style.margin = "4px";

  var clearLog = document.createElement("button");
  clearLog.type = "button";
  clearLog.innerHTML = "<i class='fa fa-minus-circle'></i>";
  clearLog.setAttribute("title", "Clear Log");
  logTop.appendChild(clearLog);
  clearLog.style.float = 'right';
  clearLog.style.display = "inline-block";
  clearLog.style.backgroundColor = "#9D4DB1";
  clearLog.style.border = "1px solid #7a3c8a";
  clearLog.style.backgroundImage = "-webkit-linear-gradient(top, #9D4DB1, #5E2E6A)";
  clearLog.style.color = "#FFFFFF";
  clearLog.style.fontSize = "14px";
  clearLog.style.borderRadius = "3px";
  clearLog.style.textAlign = "center";
  clearLog.value = "Clear Log";
  clearLog.style.width ="23px";
  clearLog.style.padding ="0px 5px 0px 5px";
  clearLog.style.margin = "4px";
  clearLog.addEventListener("click", logClear, false);

  var logTopDivide = document.createElement('hr');
  logWindow.appendChild(logTopDivide);
  logTopDivide.style.backgroundColor = '#333333';
  logTopDivide.style.align = 'center';
  logTopDivide.style.height = '1px';
  logTopDivide.style.width = '570px';
  logTopDivide.style.margin = '7px 3px 0px 3px';

  var logStuff = document.createElement('div');
  logWindow.appendChild(logStuff);

  var logs = document.createElement('span');
  logStuff.appendChild(logs);
  logs.style.color = '#008B8B'
  logs.style.fontSize = '16'
  logs.style.marginLeft = '6px';
  logs.style.marginTop = '18px';

  var setTop = document.createElement('div');
  setWindow.appendChild(setTop);

  var setLabel = document.createElement('span');
  setTop.appendChild(setLabel);
  setLabel.innerHTML = 'Settings';
  setLabel.style.fontSize = '20px';
  setLabel.style.marginLeft = '6px';
  setLabel.style.marginTop = '18px';
  setLabel.style.fontWeight = 'bold';

  var setClose = document.querySelector("#sModal > div > span");
  setTop.appendChild(setClose);
  setClose.type = "button";
  setClose.style.float = 'right';
  setClose.style.lineHeight = '1.5rem';
  setClose.style.textAlign = 'center';
  setClose.style.opacity = "0.9";
  setClose.style.cursor = 'pointer';
  setClose.innerHTML = "<i class='fa fa-times'></i>";
  setClose.style.backgroundColor = "#6D59B4";
  setClose.style.border = "1px solid #544293";
  setClose.style.backgroundImage = "-webkit-linear-gradient(top, #6D59B4, #48358C)";
  setClose.style.color = "#FFFFFF";
  setClose.style.fontSize = '14px'
  setClose.style.fontWeight = "bold";
  setClose.style.borderRadius = "3px";
  setClose.style.width ="23px";
  setClose.style.padding ="0px 5px 0px 5px";
  setClose.style.margin = "4px";

  var setTopDivide = document.createElement('hr');
  setWindow.appendChild(setTopDivide);
  setTopDivide.style.backgroundColor = '#333333';
  setTopDivide.style.align = 'center';
  setTopDivide.style.height = '1px';
  setTopDivide.style.width = '330px';
  setTopDivide.style.margin = '6px 0px 13px 0px';

  var incOptions = document.createElement('div');
  setWindow.appendChild(incOptions);
  incOptions.style.margin = '0px 0px 0px 0px';

  var incOptLabel = document.createElement('span');
  incOptions.appendChild(incOptLabel);
  incOptLabel.innerHTML = 'Accept Includes Only:';
  incOptLabel.style.fontSize = '14px';
  incOptLabel.style.fontWeight = 'bold';
  incOptLabel.style.color = "lightgrey";
  incOptLabel.style.margin = '2px 0px 6px 6px';

  var incMenu = document.createElement("select");
  incMenu.title = 'Setting this to yes will cause the auto catcher to only accept HITs that ' +
    'match your include list. The minimum pay will be determined by the minimum ' +
    'reward filter and no HITs will be checked on TO or TV.';
  incMenu.value = "Includes Only";
  incMenu.style.float = 'right';
  incMenu.style.width = '120px';
  incMenu.style.border = "1px solid #544293";
  incMenu.style.borderRadius = '3px';
  incMenu.style.fontSize = '12px';
  incMenu.style.padding = '2px 0px 2px 6px';
  incMenu.style.marginRight = '6px';
  incMenu.style.color = '#FFFFFF';
  incMenu.style.backgroundColor = "#6D59B4";
  incMenu.style.backgroundImage = "-webkit-linear-gradient(top, #6D59B4, #48358C)";
  incOptions.appendChild(incMenu);
  var incOptionNo = document.createElement("option");
  incOptionNo.value = 'No';
  incOptionNo.text = 'No';
  incOptionNo.style.fontWeight = "bold";
  incMenu.add(incOptionNo);
  var incOptionYes = document.createElement("option");
  incOptionYes.value = 'Yes';
  incOptionYes.text = 'Yes';
  incOptionYes.style.fontWeight = "bold";
  incMenu.add(incOptionYes);
  incMenu.addEventListener(
    'change',
    function() {
      var incOnly = incMenu.value;
      GM_setValue('incOnly',incOnly);},
    false
  );
  if (GM_getValue('incOnly')) {
    getMenuDefault(incMenu, GM_getValue('incOnly'));
  } else {
    incMenu.options[0].selected = 'selected';
    GM_setValue('incOnly', 'No');
  }

  var alertOptions = document.createElement('div');
  setWindow.appendChild(alertOptions);
  alertOptions.style.margin = '7px 0px 6px 0px';

  var alertLabel = document.createElement('span');
  alertOptions.appendChild(alertLabel);
  alertLabel.innerHTML = 'Alerts:';
  alertLabel.style.fontSize = '14px';
  alertLabel.style.fontWeight = 'bold';
  alertLabel.style.color = "lightgrey";
  alertLabel.style.margin = '2px 0px 6px 6px';

  var alertMenu = document.createElement("select");
  alertMenu.value = "Alert Menu";
  alertMenu.style.float = 'right';
  alertMenu.style.width = '120px';
  alertMenu.style.border = "1px solid #544293";
  alertMenu.style.borderRadius = '3px';
  alertMenu.style.fontSize = '12px';
  alertMenu.style.padding = '2px 0px 2px 6px';
  alertMenu.style.marginRight = '6px';
  alertMenu.style.color = '#FFFFFF';
  alertMenu.style.backgroundColor = "#6D59B4";
  alertMenu.style.backgroundImage = "-webkit-linear-gradient(top, #6D59B4, #48358C)";
  alertOptions.appendChild(alertMenu);
  var alertChoiceOff = document.createElement("option");
  alertChoiceOff.value = 'Off';
  alertChoiceOff.text = 'Off';
  alertChoiceOff.style.fontWeight = "bold";
  alertMenu.add(alertChoiceOff);
  var alertChoice1 = document.createElement("option");
  alertChoice1.value = 'Voice';
  alertChoice1.text = 'Voice';
  alertChoice1.style.fontWeight = "bold";
  alertMenu.add(alertChoice1);
  var alertChoice2 = document.createElement("option");
  alertChoice2.value = 'Bell';
  alertChoice2.text = 'Bell';
  alertChoice2.style.fontWeight = "bold";
  alertMenu.add(alertChoice2);
  var alertChoice3 = document.createElement("option");
  alertChoice3.value = 'Chime';
  alertChoice3.text = 'Chime';
  alertChoice3.style.fontWeight = "bold";
  alertMenu.add(alertChoice3);
  alertMenu.addEventListener(
    'change',
    function() {
      var alert = alertMenu.value;
      GM_setValue('alert',alert);},
    false
  );
  if (GM_getValue('alert')) {
    getMenuDefault(alertMenu, GM_getValue('alert'));
  } else {
    alertMenu.options[0].selected = 'selected';
    GM_setValue('alert', 'Off');
  }

  var pageOptions = document.createElement('div');
  setWindow.appendChild(pageOptions);
  pageOptions.style.margin = '7px 0px 8px 0px';

  var pageOptLabel = document.createElement('span');
  pageOptions.appendChild(pageOptLabel);
  pageOptLabel.innerHTML = 'Page Size:';
  pageOptLabel.style.fontSize = '14px';
  pageOptLabel.style.fontWeight = 'bold';
  pageOptLabel.style.color = "lightgrey";
  pageOptLabel.style.margin = '6px 0px 6px 6px';

  var pageOptInput = document.createElement("input");
  pageOptInput.setAttribute("type", "number");
  pageOptInput.innerHTML =
    '<style>' +
    'input[type=number]::-webkit-outer-spin-button,' +
    'input[type=number]::-webkit-inner-spin-button {' +
    '-webkit-appearance: inner-spin-button !important;' +
    '}' +
    '</style>'
  pageOptInput.title = 'Sets the number of results per page/scan. Recommend keeping this ' +
    'low to prevent long load times between scans.';
  if (GM_getValue('pageSize') !== undefined) {
    pageOptInput.value = GM_getValue('pageSize');
  } else {
    pageOptInput.value = '10';
    GM_setValue('pageSize','10');
  }
  pageOptInput.step = '1';
  pageOptInput.min = '10';
  pageOptInput.max = '50';
  pageOptInput.style.float = 'right';
  pageOptInput.style.width = '120px';
  pageOptInput.style.border = "1px solid #544293";
  pageOptInput.style.borderRadius = '3px';
  pageOptInput.style.fontSize = '12px';
  pageOptInput.style.padding = '2px 0px 2px 10px';
  pageOptInput.style.marginRight = '6px';
  pageOptInput.style.color = '#FFFFFF';
  pageOptInput.style.backgroundColor = "#6D59B4";
  pageOptInput.style.backgroundImage = "-webkit-linear-gradient(top, #6D59B4, #48358C)";
  pageOptions.appendChild(pageOptInput);
  pageOptInput.addEventListener(
    'change',
    function() {
      var pageSize = pageOptInput.value;
      GM_setValue('pageSize',pageSize);
    },
    false
  );

  var rewardOptions = document.createElement('div');
  setWindow.appendChild(rewardOptions);
  rewardOptions.style.margin = '7px 0px 8px 0px';

  var rewardLabel = document.createElement('span');
  rewardOptions.appendChild(rewardLabel);
  rewardLabel.innerHTML = 'Minimum Reward Filter:';
  rewardLabel.style.fontSize = '14px';
  rewardLabel.style.fontWeight = 'bold';
  rewardLabel.style.color = "lightgrey";
  rewardLabel.style.margin = '6px 0px 6px 6px';

  var rewardOptInput = document.createElement("input");
  rewardOptInput.setAttribute("type", "number");
  rewardOptInput.innerHTML =
    '<style>' +
    'input[type=number]::-webkit-outer-spin-button,' +
    'input[type=number]::-webkit-inner-spin-button {' +
    '-webkit-appearance: inner-spin-button !important;' +
    '}' +
    '</style>'
  rewardOptInput.title = 'Sets the minimum reward search filter on MTurk. No HITs below ' +
    'this amount will ever be accepted, regardless of settings.'
  if (GM_getValue('minReward') !== undefined) {
    rewardOptInput.value = GM_getValue('minReward');
  } else {
    rewardOptInput.value = '0.10';
    GM_setValue('minReward','0.10');
  }
  rewardOptInput.step = '0.01';
  rewardOptInput.min = '0.00';
  rewardOptInput.max = '10.00';
  rewardOptInput.style.float = 'right';
  rewardOptInput.style.width = '120px';
  rewardOptInput.style.border = "1px solid #544293";
  rewardOptInput.style.borderRadius = '3px';
  rewardOptInput.style.fontSize = '12px';
  rewardOptInput.style.padding = '2px 0px 2px 10px';
  rewardOptInput.style.marginRight = '6px';
  rewardOptInput.style.color = '#FFFFFF';
  rewardOptInput.style.backgroundColor = "#6D59B4";
  rewardOptInput.style.backgroundImage = "-webkit-linear-gradient(top, #6D59B4, #48358C)";
  rewardOptions.appendChild(rewardOptInput);
  rewardOptInput.addEventListener(
    'change',
    function() {
      var minReward = rewardOptInput.value;
      GM_setValue('minReward',minReward);
    },
    false
  );
  /*
  var logOptions = document.createElement('div');
  setWindow.appendChild(logOptions);
  logOptions.style.margin = '8px 0px 8px 0px';

  var logOptLabel = document.createElement('span');
  logOptions.appendChild(logOptLabel);
  logOptLabel.innerHTML = 'Review Log Time (Minutes):';
  logOptLabel.style.fontSize = '14px';
  logOptLabel.style.fontWeight = 'bold';
  logOptLabel.style.color = "lightgrey";
  logOptLabel.style.margin = '6px 0px 6px 6px';

  var logOptInput = document.createElement("input");
  logOptInput.setAttribute("type", "number");
  logOptInput.innerHTML =
  '<style>' +
    'input[type=number]::-webkit-outer-spin-button,' +
    'input[type=number]::-webkit-inner-spin-button {' +
      '-webkit-appearance: inner-spin-button !important;' +
    '}' +
  '</style>'
  logOptInput.title = '';
  if (GM_getValue('logTime') !== undefined) {
    logOptInput.value = GM_getValue('logTime');
  } else {
    logOptInput.value = '30';
    GM_setValue('logTime','30');
  }
  logOptInput.step = '1';
  logOptInput.min = '1';
  logOptInput.max = '60';
  logOptInput.style.float = 'right';
  logOptInput.style.width = '120px';
  logOptInput.style.border = "1px solid #544293";
  logOptInput.style.borderRadius = '3px';
  logOptInput.style.fontSize = '12px';
  logOptInput.style.padding = '2px 0px 2px 10px';
  logOptInput.style.marginRight = '6px';
  logOptInput.style.color = '#FFFFFF';
  logOptInput.style.backgroundColor = "#6D59B4";
  logOptInput.style.backgroundImage = "-webkit-gradient(linear, left top, left bottom, from(#6D59B4), to(#48358C))";
  logOptInput.style.backgroundImage = "-webkit-linear-gradient(top, #6D59B4, #48358C)";
  logOptInput.style.backgroundImage = "-moz-linear-gradient(top, #6D59B4, #48358C)";
  logOptInput.style.backgroundImage = "-ms-linear-gradient(top, #6D59B4, #48358C)";
  logOptInput.style.backgroundImage = "-o-linear-gradient(top, #6D59B4, #48358C)";
  logOptInput.style.backgroundImage = "linear-gradient(to bottom, #6D59B4, #48358C)";
  logOptInput.style.filter = "progid:DXImageTransform.Microsoft.gradient(GradientType=0,startColorstr=#6D59B4, endColorstr=#48358C)";
  logOptions.appendChild(logOptInput);
  logOptInput.addEventListener(
    'change',
    function() {
      var logTime = logOptInput.value;
      GM_setValue('logTime',logTime);
    },
    false
  );
*/
  var pAddTop = document.createElement('div');
  pAddWindow.appendChild(pAddTop);
  pAddTop.style.height = '24px';

  var pAddLabel = document.createElement('span');
  pAddTop.appendChild(pAddLabel);
  pAddLabel.innerHTML = 'Add Panda';
  pAddLabel.style.fontSize = '20px';
  pAddLabel.style.marginLeft = '6px';
  pAddLabel.style.marginTop = '18px';
  pAddLabel.style.fontWeight = 'bold';

  var pAddClose = document.querySelector("#pAddModal > div > span");
  pAddTop.appendChild(pAddClose);
  pAddClose.type = "button";
  pAddClose.style.float = 'right';
  pAddClose.style.lineHeight = '1.5rem';
  pAddClose.style.textAlign = 'center';
  pAddClose.style.opacity = "0.9";
  pAddClose.style.cursor = 'pointer';
  pAddClose.innerHTML = "<i class='fa fa-times'></i>";
  pAddClose.style.backgroundColor = "#6D59B4";
  pAddClose.style.border = "1px solid #544293";
  pAddClose.style.backgroundImage = "-webkit-linear-gradient(top, #6D59B4, #48358C)";
  pAddClose.style.color = "#FFFFFF";
  pAddClose.style.fontSize = '14px'
  pAddClose.style.fontWeight = "bold";
  pAddClose.style.borderRadius = "3px";
  pAddClose.style.width ="23px";
  pAddClose.style.padding ="0px 5px 0px 5px";
  pAddClose.style.margin = "4px";

  var pAddTopDivide = document.createElement('hr');
  pAddWindow.appendChild(pAddTopDivide);
  pAddTopDivide.style.backgroundColor = '#333333';
  pAddTopDivide.style.align = 'center';
  pAddTopDivide.style.height = '1px';
  pAddTopDivide.style.width = '330px';
  pAddTopDivide.style.margin = '13px 0px 12px 3px';

  var pAddInfo = document.createElement('div');
  pAddWindow.appendChild(pAddInfo);
  pAddInfo.style.minHeight = '85px';

  var pAddMatchOptions = document.createElement('div');
  pAddInfo.appendChild(pAddMatchOptions);
  pAddMatchOptions.style.margin = '7px 0px 12px 0px';

  var pAddMatchLabel = document.createElement('span');
  pAddMatchOptions.appendChild(pAddMatchLabel);
  pAddMatchLabel.innerHTML = 'Group ID:';
  pAddMatchLabel.style.fontSize = '14px';
  pAddMatchLabel.style.fontWeight = 'bold';
  pAddMatchLabel.style.color = "lightgrey";
  pAddMatchLabel.style.margin = '6px 0px 6px 6px';

  var pAddMatchInput = document.createElement("input");
  pAddMatchInput.title = 'Enter the group ID here';
  pAddMatchInput.style.float = 'right';
  pAddMatchInput.style.width = '250px';
  pAddMatchInput.style.border = "1px solid #544293";
  pAddMatchInput.style.borderRadius = '3px';
  pAddMatchInput.style.fontSize = '12px';
  pAddMatchInput.style.padding = '2px 0px 2px 10px';
  pAddMatchInput.style.marginRight = '6px';
  pAddMatchInput.style.color = '#FFFFFF';
  pAddMatchInput.style.backgroundColor = "#6D59B4";
  pAddMatchInput.style.backgroundImage = "-webkit-linear-gradient(top, #6D59B4, #48358C)";
  pAddMatchOptions.appendChild(pAddMatchInput);

  var pAddNameOptions = document.createElement('div');
  pAddInfo.appendChild(pAddNameOptions);
  pAddNameOptions.style.margin = '12px 0px 12px 0px';

  var pAddNameLabel = document.createElement('span');
  pAddNameOptions.appendChild(pAddNameLabel);
  pAddNameLabel.innerHTML = 'Name:';
  pAddNameLabel.style.fontSize = '14px';
  pAddNameLabel.style.fontWeight = 'bold';
  pAddNameLabel.style.color = "lightgrey";
  pAddNameLabel.style.margin = '12px 0px 12px 6px';

  var pAddNameInput = document.createElement("input");
  pAddNameInput.title = 'Enter a name for this panda';
  pAddNameInput.style.float = 'right';
  pAddNameInput.style.width = '250px';
  pAddNameInput.style.border = "1px solid #544293";
  pAddNameInput.style.borderRadius = '3px';
  pAddNameInput.style.fontSize = '12px';
  pAddNameInput.style.padding = '2px 0px 2px 10px';
  pAddNameInput.style.marginRight = '6px';
  pAddNameInput.style.color = '#FFFFFF';
  pAddNameInput.style.backgroundColor = "#6D59B4";
  pAddNameInput.style.backgroundImage = "-webkit-linear-gradient(top, #6D59B4, #48358C)";
  pAddNameOptions.appendChild(pAddNameInput);

  var pAddPandaOptions = document.createElement('div');
  pAddInfo.appendChild(pAddPandaOptions);
  pAddPandaOptions.style.margin = '12px 0px 12px 0px';

  var pAddPandaLabel = document.createElement('span');
  pAddPandaOptions.appendChild(pAddPandaLabel);
  pAddPandaLabel.innerHTML = 'How many:';
  pAddPandaLabel.style.fontSize = '14px';
  pAddPandaLabel.style.fontWeight = 'bold';
  pAddPandaLabel.style.color = "lightgrey";
  pAddPandaLabel.style.margin = '12px 0px 12px 6px';

  var pAddPandaMenu = document.createElement("select");
  pAddPandaMenu.title = 'Panda one HIT or multiple HITs.'
  pAddPandaMenu.value = "How many";
  pAddPandaMenu.style.float = 'right';
  pAddPandaMenu.style.width = '120px';
  pAddPandaMenu.style.border = "1px solid #544293";
  pAddPandaMenu.style.borderRadius = '3px';
  pAddPandaMenu.style.fontSize = '12px';
  pAddPandaMenu.style.padding = '2px 0px 2px 6px';
  pAddPandaMenu.style.marginRight = '6px';
  pAddPandaMenu.style.color = '#FFFFFF';
  pAddPandaMenu.style.backgroundColor = "#6D59B4";
  pAddPandaMenu.style.backgroundImage = "-webkit-linear-gradient(top, #6D59B4, #48358C)";
  pAddPandaOptions.appendChild(pAddPandaMenu);
  var pAddPandaOptOne = document.createElement("option");
  pAddPandaOptOne.value = 'One';
  pAddPandaOptOne.text = 'Panda one';
  pAddPandaOptOne.style.fontWeight = "bold";
  pAddPandaMenu.add(pAddPandaOptOne);
  var pAddPandaOptMany = document.createElement("option");
  pAddPandaOptMany.value = 'Many';
  pAddPandaOptMany.text = 'Panda many';
  pAddPandaOptMany.style.fontWeight = "bold";
  pAddPandaMenu.add(pAddPandaOptMany);
  pAddPandaMenu.addEventListener(
    'change',
    function() {
      if (pAddPandaMenu.value == 'Many') {
        pAddQueueOptions.style.opacity = '1';
        pAddQueueInput.disabled = false;
      }
      if (pAddPandaMenu.value == 'One') {
        pAddQueueOptions.style.opacity = '0.25';
        pAddQueueInput.disabled = true;
      }
    }, false);

  var pAddQueueOptions = document.createElement('div');
  pAddInfo.appendChild(pAddQueueOptions);
  pAddQueueOptions.style.margin = '12px 0px 12px 0px';
  pAddQueueOptions.style.opacity = '0.25';

  var pAddQueueLabel = document.createElement('span');
  pAddQueueOptions.appendChild(pAddQueueLabel);
  pAddQueueLabel.innerHTML = 'Queue limit:';
  pAddQueueLabel.style.fontSize = '14px';
  pAddQueueLabel.style.fontWeight = 'bold';
  pAddQueueLabel.style.color = "lightgrey";
  pAddQueueLabel.style.margin = '12px 0px 12px 6px';

  var pAddQueueInput = document.createElement('input');
  pAddQueueInput.setAttribute("type", "number");
  pAddQueueInput.innerHTML =
    '<style>' +
    'input[type=number]::-webkit-outer-spin-button,' +
    'input[type=number]::-webkit-inner-spin-button {' +
    '-webkit-appearance: inner-spin-button !important;' +
    '}' +
    '</style>'
  pAddQueueInput.title = 'Maximum number of HITs with this ID to keep in queue';
  pAddQueueInput.disabled = 'true';
  pAddQueueInput.value = '25';
  pAddQueueInput.step = '1';
  pAddQueueInput.min = '1';
  pAddQueueInput.max = '25';
  pAddQueueInput.style.float = 'right';
  pAddQueueInput.style.width = '120px';
  pAddQueueInput.style.border = "1px solid #544293";
  pAddQueueInput.style.borderRadius = '3px';
  pAddQueueInput.style.fontSize = '12px';
  pAddQueueInput.style.padding = '2px 0px 2px 6px';
  pAddQueueInput.style.marginRight = '6px';
  pAddQueueInput.style.color = '#FFFFFF';
  pAddQueueInput.style.backgroundColor = "#6D59B4";
  pAddQueueInput.style.backgroundImage = "-webkit-linear-gradient(top, #6D59B4, #48358C)";
  pAddQueueOptions.appendChild(pAddQueueInput);

  var pAddLimitOptions = document.createElement('div');
  pAddInfo.appendChild(pAddLimitOptions);
  pAddLimitOptions.style.margin = '12px 0px 12px 0px';

  var pAddLimitLabel = document.createElement('span');
  pAddLimitOptions.appendChild(pAddLimitLabel);
  pAddLimitLabel.innerHTML = 'Search limit (0 for unlimited):';
  pAddLimitLabel.style.fontSize = '14px';
  pAddLimitLabel.style.fontWeight = 'bold';
  pAddLimitLabel.style.color = "lightgrey";
  pAddLimitLabel.style.margin = '12px 0px 12px 6px';

  var pAddLimitInput = document.createElement('input');
  pAddLimitInput.setAttribute("type", "number");
  pAddLimitInput.innerHTML =
    '<style>' +
    'input[type=number]::-webkit-outer-spin-button,' +
    'input[type=number]::-webkit-inner-spin-button {' +
    '-webkit-appearance: inner-spin-button !important;' +
    '}' +
    '</style>'
  pAddLimitInput.title = 'Automatically disable the panda after it has searched ' +
    'this many times (0 for no limit)';
  pAddLimitInput.value = '0';
  pAddLimitInput.step = '1';
  pAddLimitInput.min = '0';
  pAddLimitInput.max = '99999';
  pAddLimitInput.style.float = 'right';
  pAddLimitInput.style.width = '120px';
  pAddLimitInput.style.border = "1px solid #544293";
  pAddLimitInput.style.borderRadius = '3px';
  pAddLimitInput.style.fontSize = '12px';
  pAddLimitInput.style.padding = '2px 0px 2px 6px';
  pAddLimitInput.style.marginRight = '6px';
  pAddLimitInput.style.color = '#FFFFFF';
  pAddLimitInput.style.backgroundColor = "#6D59B4";
  pAddLimitInput.style.backgroundImage = "-webkit-linear-gradient(top, #6D59B4, #48358C)";
  pAddLimitOptions.appendChild(pAddLimitInput);

  var pAddBotDivide = document.createElement('hr');
  pAddWindow.appendChild(pAddBotDivide);
  pAddBotDivide.style.backgroundColor = '#333333';
  pAddBotDivide.style.align = 'center';
  pAddBotDivide.style.height = '1px';
  pAddBotDivide.style.width = '330px';
  pAddBotDivide.style.margin = '14px 0px 6px 3px';

  var pAddBot = document.createElement('div');
  pAddWindow.appendChild(pAddBot);
  pAddBot.style.margin = '0px 4px 0px 2px';

  var pAddSave = document.createElement("input");
  pAddSave.type = "button";
  pAddSave.value = "Save";
  pAddBot.appendChild(pAddSave);
  pAddSave.style.float = 'right';
  pAddSave.style.width ="80px";
  pAddSave.style.border = "1px solid #544293";
  pAddSave.style.borderRadius = "3px";
  pAddSave.style.fontSize = "12px";
  pAddSave.style.padding = "5px 10px 5px 10px";
  pAddSave.style.margin = "5px";
  pAddSave.style.display = "inline-block";
  pAddSave.style.color = "#FFFFFF";
  pAddSave.style.backgroundColor = "#6D59B4";
  pAddSave.style.backgroundImage = "-webkit-linear-gradient(top, #6D59B4, #48358C)";
  pAddSave.addEventListener("click", addNewPanda, false);

  var pEditTop = document.createElement('div');
  pEditWindow.appendChild(pEditTop);
  pEditTop.style.height = '24px';

  var pEditLabel = document.createElement('span');
  pEditTop.appendChild(pEditLabel);
  pEditLabel.innerHTML = 'Edit Panda';
  pEditLabel.style.fontSize = '20px';
  pEditLabel.style.marginLeft = '6px';
  pEditLabel.style.marginTop = '18px';
  pEditLabel.style.fontWeight = 'bold';

  var pEditClose = document.querySelector("#pEditModal > div > span");
  pEditTop.appendChild(pEditClose);
  pEditClose.type = "button";
  pEditClose.style.float = 'right';
  pEditClose.style.lineHeight = '1.5rem';
  pEditClose.style.textAlign = 'center';
  pEditClose.style.opacity = "0.9";
  pEditClose.style.cursor = 'pointer';
  pEditClose.innerHTML = "<i class='fa fa-times'></i>";
  pEditClose.style.backgroundColor = "#6D59B4";
  pEditClose.style.border = "1px solid #544293";
  pEditClose.style.backgroundImage = "-webkit-linear-gradient(top, #6D59B4, #48358C)";
  pEditClose.style.color = "#FFFFFF";
  pEditClose.style.fontSize = '14px'
  pEditClose.style.fontWeight = "bold";
  pEditClose.style.borderRadius = "3px";
  pEditClose.style.width ="23px";
  pEditClose.style.padding ="0px 5px 0px 5px";
  pEditClose.style.margin = "4px";

  var pEditTopDivide = document.createElement('hr');
  pEditWindow.appendChild(pEditTopDivide);
  pEditTopDivide.style.backgroundColor = '#333333';
  pEditTopDivide.style.align = 'center';
  pEditTopDivide.style.height = '1px';
  pEditTopDivide.style.width = '330px';
  pEditTopDivide.style.margin = '13px 0px 12px 3px';

  var pEditInfo = document.createElement('div');
  pEditWindow.appendChild(pEditInfo);
  pEditInfo.style.minHeight = '85px';

  var pEditMatchOptions = document.createElement('div');
  pEditInfo.appendChild(pEditMatchOptions);
  pEditMatchOptions.style.margin = '7px 0px 12px 0px';

  var pEditMatchLabel = document.createElement('span');
  pEditMatchOptions.appendChild(pEditMatchLabel);
  pEditMatchLabel.innerHTML = 'Group ID:';
  pEditMatchLabel.style.fontSize = '14px';
  pEditMatchLabel.style.fontWeight = 'bold';
  pEditMatchLabel.style.color = "lightgrey";
  pEditMatchLabel.style.margin = '6px 0px 6px 6px';

  var pEditMatchInput = document.createElement("input");
  pEditMatchInput.title = 'Enter the group ID here';
  pEditMatchInput.style.float = 'right';
  pEditMatchInput.style.width = '250px';
  pEditMatchInput.style.border = "1px solid #544293";
  pEditMatchInput.style.borderRadius = '3px';
  pEditMatchInput.style.fontSize = '12px';
  pEditMatchInput.style.padding = '2px 0px 2px 10px';
  pEditMatchInput.style.marginRight = '6px';
  pEditMatchInput.style.color = '#FFFFFF';
  pEditMatchInput.style.backgroundColor = "#6D59B4";
  pEditMatchInput.style.backgroundImage = "-webkit-linear-gradient(top, #6D59B4, #48358C)";
  pEditMatchOptions.appendChild(pEditMatchInput);

  var pEditNameOptions = document.createElement('div');
  pEditInfo.appendChild(pEditNameOptions);
  pEditNameOptions.style.margin = '12px 0px 12px 0px';

  var pEditNameLabel = document.createElement('span');
  pEditNameOptions.appendChild(pEditNameLabel);
  pEditNameLabel.innerHTML = 'Name:';
  pEditNameLabel.style.fontSize = '14px';
  pEditNameLabel.style.fontWeight = 'bold';
  pEditNameLabel.style.color = "lightgrey";
  pEditNameLabel.style.margin = '12px 0px 12px 6px';

  var pEditNameInput = document.createElement("input");
  pEditNameInput.title = 'Enter a name for this panda';
  pEditNameInput.style.float = 'right';
  pEditNameInput.style.width = '250px';
  pEditNameInput.style.border = "1px solid #544293";
  pEditNameInput.style.borderRadius = '3px';
  pEditNameInput.style.fontSize = '12px';
  pEditNameInput.style.padding = '2px 0px 2px 10px';
  pEditNameInput.style.marginRight = '6px';
  pEditNameInput.style.color = '#FFFFFF';
  pEditNameInput.style.backgroundColor = "#6D59B4";
  pEditNameInput.style.backgroundImage = "-webkit-linear-gradient(top, #6D59B4, #48358C)";
  pEditNameOptions.appendChild(pEditNameInput);

  var pEditPandaOptions = document.createElement('div');
  pEditInfo.appendChild(pEditPandaOptions);
  pEditPandaOptions.style.margin = '12px 0px 12px 0px';

  var pEditPandaLabel = document.createElement('span');
  pEditPandaOptions.appendChild(pEditPandaLabel);
  pEditPandaLabel.innerHTML = 'How many:';
  pEditPandaLabel.style.fontSize = '14px';
  pEditPandaLabel.style.fontWeight = 'bold';
  pEditPandaLabel.style.color = "lightgrey";
  pEditPandaLabel.style.margin = '12px 0px 12px 6px';

  var pEditPandaMenu = document.createElement("select");
  pEditPandaMenu.title = 'Panda one HIT or multiple HITs.'
  pEditPandaMenu.value = "How many";
  pEditPandaMenu.style.float = 'right';
  pEditPandaMenu.style.width = '120px';
  pEditPandaMenu.style.border = "1px solid #544293";
  pEditPandaMenu.style.borderRadius = '3px';
  pEditPandaMenu.style.fontSize = '12px';
  pEditPandaMenu.style.padding = '2px 0px 2px 6px';
  pEditPandaMenu.style.marginRight = '6px';
  pEditPandaMenu.style.color = '#FFFFFF';
  pEditPandaMenu.style.backgroundColor = "#6D59B4";
  pEditPandaMenu.style.backgroundImage = "-webkit-linear-gradient(top, #6D59B4, #48358C)";
  pEditPandaOptions.appendChild(pEditPandaMenu);
  var pEditPandaOptOne = document.createElement("option");
  pEditPandaOptOne.value = 'One';
  pEditPandaOptOne.text = 'Panda one';
  pEditPandaOptOne.style.fontWeight = "bold";
  pEditPandaMenu.add(pEditPandaOptOne);
  var pEditPandaOptMany = document.createElement("option");
  pEditPandaOptMany.value = 'Many';
  pEditPandaOptMany.text = 'Panda many';
  pEditPandaOptMany.style.fontWeight = "bold";
  pEditPandaMenu.add(pEditPandaOptMany);
  pEditPandaMenu.addEventListener(
    'change',
    function() {
      if (pEditPandaMenu.value == 'Many') {
        pEditQueueOptions.style.opacity = '1';
        pEditQueueInput.disabled = false;
      }
      if (pEditPandaMenu.value == 'One') {
        pEditQueueOptions.style.opacity = '0.25';
        pEditQueueInput.disabled = true;
      }
    }, false);

  var pEditQueueOptions = document.createElement('div');
  pEditInfo.appendChild(pEditQueueOptions);
  pEditQueueOptions.style.margin = '12px 0px 12px 0px';
  pEditQueueOptions.style.opacity = '0.25';

  var pEditQueueLabel = document.createElement('span');
  pEditQueueOptions.appendChild(pEditQueueLabel);
  pEditQueueLabel.innerHTML = 'Queue limit:';
  pEditQueueLabel.style.fontSize = '14px';
  pEditQueueLabel.style.fontWeight = 'bold';
  pEditQueueLabel.style.color = "lightgrey";
  pEditQueueLabel.style.margin = '12px 0px 12px 6px';

  var pEditQueueInput = document.createElement('input');
  pEditQueueInput.setAttribute("type", "number");
  pEditQueueInput.innerHTML =
    '<style>' +
    'input[type=number]::-webkit-outer-spin-button,' +
    'input[type=number]::-webkit-inner-spin-button {' +
    '-webkit-appearance: inner-spin-button !important;' +
    '}' +
    '</style>'
  pEditQueueInput.title = 'Maximum number of HITs with this ID to keep in queue';
  pEditQueueInput.disabled = 'true';
  pEditQueueInput.value = '25';
  pEditQueueInput.step = '1';
  pEditQueueInput.min = '1';
  pEditQueueInput.max = '25';
  pEditQueueInput.style.float = 'right';
  pEditQueueInput.style.width = '120px';
  pEditQueueInput.style.border = "1px solid #544293";
  pEditQueueInput.style.borderRadius = '3px';
  pEditQueueInput.style.fontSize = '12px';
  pEditQueueInput.style.padding = '2px 0px 2px 6px';
  pEditQueueInput.style.marginRight = '6px';
  pEditQueueInput.style.color = '#FFFFFF';
  pEditQueueInput.style.backgroundColor = "#6D59B4";
  pEditQueueInput.style.backgroundImage = "-webkit-linear-gradient(top, #6D59B4, #48358C)";
  pEditQueueOptions.appendChild(pEditQueueInput);

  var pEditLimitOptions = document.createElement('div');
  pEditInfo.appendChild(pEditLimitOptions);
  pEditLimitOptions.style.margin = '12px 0px 12px 0px';

  var pEditLimitLabel = document.createElement('span');
  pEditLimitOptions.appendChild(pEditLimitLabel);
  pEditLimitLabel.innerHTML = 'Search limit (0 for unlimited):';
  pEditLimitLabel.style.fontSize = '14px';
  pEditLimitLabel.style.fontWeight = 'bold';
  pEditLimitLabel.style.color = "lightgrey";
  pEditLimitLabel.style.margin = '12px 0px 12px 6px';

  var pEditLimitInput = document.createElement('input');
  pEditLimitInput.setAttribute("type", "number");
  pEditLimitInput.innerHTML =
    '<style>' +
    'input[type=number]::-webkit-outer-spin-button,' +
    'input[type=number]::-webkit-inner-spin-button {' +
    '-webkit-appearance: inner-spin-button !important;' +
    '}' +
    '</style>'
  pEditLimitInput.title = 'Automatically disable the panda after it has ' +
    'searched this many times (0 for no limit)';
  pEditLimitInput.value = '0';
  pEditLimitInput.step = '1';
  pEditLimitInput.min = '0';
  pEditLimitInput.max = '99999';
  pEditLimitInput.style.float = 'right';
  pEditLimitInput.style.width = '120px';
  pEditLimitInput.style.border = "1px solid #544293";
  pEditLimitInput.style.borderRadius = '3px';
  pEditLimitInput.style.fontSize = '12px';
  pEditLimitInput.style.padding = '2px 0px 2px 6px';
  pEditLimitInput.style.marginRight = '6px';
  pEditLimitInput.style.color = '#FFFFFF';
  pEditLimitInput.style.backgroundColor = "#6D59B4";
  pEditLimitInput.style.backgroundImage = "-webkit-linear-gradient(top, #6D59B4, #48358C)";
  pEditLimitOptions.appendChild(pEditLimitInput);

  var pEditBotDivide = document.createElement('hr');
  pEditWindow.appendChild(pEditBotDivide);
  pEditBotDivide.style.backgroundColor = '#333333';
  pEditBotDivide.style.align = 'center';
  pEditBotDivide.style.height = '1px';
  pEditBotDivide.style.width = '330px';
  pEditBotDivide.style.margin = '14px 0px 6px 3px';

  var pEditBot = document.createElement('div');
  pEditWindow.appendChild(pEditBot);
  pEditBot.style.margin = '0px 4px 0px 2px';

  var pEditSave = document.createElement("input");
  pEditSave.type = "button";
  pEditSave.value = "Save";
  pEditBot.appendChild(pEditSave);
  pEditSave.style.float = 'right';
  pEditSave.style.width ="80px";
  pEditSave.style.border = "1px solid #544293";
  pEditSave.style.borderRadius = "3px";
  pEditSave.style.fontSize = "12px";
  pEditSave.style.padding = "5px 10px 5px 10px";
  pEditSave.style.margin = "5px";
  pEditSave.style.display = "inline-block";
  pEditSave.style.color = "#FFFFFF";
  pEditSave.style.backgroundColor = "#6D59B4";
  pEditSave.style.backgroundImage = "-webkit-linear-gradient(top, #6D59B4, #48358C)";
  pEditSave.onclick = function() {
    updatePanda(selectedPanda)
  }

  var pEditDelete = document.createElement("input");
  pEditDelete.type = "button";
  pEditDelete.value = "Delete";
  pEditBot.appendChild(pEditDelete);
  pEditDelete.style.float = 'right';
  pEditDelete.style.width ="80px";
  pEditDelete.style.border = "1px solid #7a3c8a";
  pEditDelete.style.borderRadius = "3px";
  pEditDelete.style.fontSize = "12px";
  pEditDelete.style.padding = "5px 10px 5px 10px";
  pEditDelete.style.margin = "5px";
  pEditDelete.style.display = "inline-block";
  pEditDelete.style.color = "#FFFFFF";
  pEditDelete.style.backgroundColor = "#9D4DB1";
  pEditDelete.style.backgroundImage = "-webkit-linear-gradient(top, #9D4DB1, #5E2E6A)";
  pEditDelete.onclick = function() {
    scrapPanda(selectedPanda);
  }

  function scrapPanda(card) {
    var i = 0;
    for (i = 0; i < pandaCards.length; i++) {
      if (pandaCards[i][1].trim() === card.title.trim()) {
        pandaCards.splice(i, 1);
        GM_setValue('pandaCards', JSON.stringify(pandaCards));
        GM_deleteValue('Alert ' + card.title);
        GM_deleteValue('Collect ' + card.title);
        //GM_deleteValue('Queue ' + card.title);
        removeFromQueue(card.title);
        card.remove();
      }
    }
    pEditModal.style.display = "none";
  }

  var pName = pandaCards.sort(([a], [b]) => a.toLowerCase().localeCompare(b.toLowerCase()));

  function pAlertOn(gid) {
    GM_setValue('Alert ' + gid, "alertOn");
    selectedAlert.value = "Alerts: On";
    selectedAlert.style.border = "1px solid #7a3c8a";
    selectedAlert.style.backgroundColor = "#9D4DB1";
    selectedAlert.style.backgroundImage = "-webkit-linear-gradient(top, #9D4DB1, #5E2E6A)";
  }

  function pAlertOff(gid) {
    GM_setValue('Alert ' + gid, "alertOff");
    selectedAlert.value = "Alerts: Off";
    selectedAlert.style.border = "1px solid #544293";
    selectedAlert.style.backgroundColor = "#6D59B4";
    selectedAlert.style.backgroundImage = "-webkit-linear-gradient(top, #6D59B4, #48358C)";
  }

  function pAlert(gid) {
    if (GM_getValue('Alert ' + gid) === "alertOn"){
      pAlertOff(gid);
    } else {
      pAlertOn(gid);
    }
  }

  function pCollectOn(gid) {
    GM_setValue('Collect ' + gid, "collectOn");
    selectedCollect.value = "Collecting";
    selectedCollect.style.border = "1px solid #7a3c8a";
    selectedCollect.style.backgroundColor = "#9D4DB1";
    selectedCollect.style.backgroundImage = "-webkit-linear-gradient(top, #9D4DB1, #5E2E6A)";
  }

  function pCollectOff(gid) {
    GM_setValue('Collect ' + gid, "collectOff");
    selectedCollect.value = "Collect";
    selectedCollect.style.border = "1px solid #36658c";
    selectedCollect.style.backgroundColor = "#4682B4";
    selectedCollect.style.backgroundImage = "-webkit-linear-gradient(top, #4682B4, #1D517B)";
  }

  function pCollect(gid) {
    if (GM_getValue('Collect ' + gid) === "collectOn") {
      pCollectOff(gid);
    } else {
      pCollectOn(gid);
    }
  }

  function makePandaCard(name, match, hitName, howMany, pay, queue, limit, fromInclude) {
    var pandaCard = document.createElement("card");
    pandaCard.setAttribute("class","pCard");
    pandaCard.setAttribute("title", match);
    pandaCard.setAttribute("howmany", howMany);
    pandaCard.setAttribute("hitname", hitName);
    pandaCard.setAttribute("pay", pay);
    pandaCard.setAttribute("limit", limit);
    pandaCard.setAttribute("queue", queue);
    pandaCard.value = name;
    pandas.appendChild(pandaCard);
    pandaCard.style.height ="90px";
    pandaCard.style.width ="250px";
    pandaCard.style.border = "1px solid #005353";
    pandaCard.style.borderRadius = "3px";
    pandaCard.style.fontSize = "12px";
    pandaCard.style.margin = "8px";
    pandaCard.style.display = "inline-block";
    pandaCard.style.color = "#FFFFFF";
    pandaCard.style.backgroundColor = "#212121";

    var pandaHeader = document.createElement('card-header');
    pandaCard.appendChild(pandaHeader);
    pandaHeader.style.display = "inline-block";
    pandaHeader.style.height ="24px";
    pandaHeader.style.width ="248px";
    pandaHeader.style.borderTopLeftRadius = "3px";
    pandaHeader.style.borderTopRightRadius = "3px";
    pandaHeader.style.backgroundColor = "#008B8B";
    pandaHeader.style.backgroundImage = "-webkit-linear-gradient(top, #008B8B, #005656)";

    var pandaLabel = document.createElement('div');
    pandaHeader.appendChild(pandaLabel);
    pandaLabel.innerHTML = name;
    pandaLabel.style.fontSize = "12px";
    pandaLabel.style.padding = "3px 6px 3px 6px";
    pandaLabel.style.display = "inline-block";
    pandaLabel.style.color = "#FFFFFF";
    pandaLabel.style.width = '220px';
    pandaLabel.style.height = '20px';
    pandaLabel.style.overflow = 'hidden';

    var pandaClose = document.createElement('button');
    pandaHeader.appendChild(pandaClose);
    pandaClose.style.float = 'right';
    pandaClose.style.lineHeight = '1.2rem';
    pandaClose.style.textAlign = 'center';
    pandaClose.style.opacity = "0.9";
    pandaClose.style.cursor = 'pointer';
    pandaClose.innerHTML = "<i class='fa fa-times'></i>";
    pandaClose.style.backgroundColor = "#6D59B4";
    pandaClose.style.border = "1px solid #544293";
    pandaClose.style.backgroundImage = "-webkit-linear-gradient(top, #6D59B4, #48358C)";
    pandaClose.style.color = "#FFFFFF";
    pandaClose.style.fontSize = '14px'
    pandaClose.style.fontWeight = "bold";
    pandaClose.style.borderRadius = "3px";
    pandaClose.style.width ="18px";
    pandaClose.style.height ="18px";
    pandaClose.style.padding ="0px 3px 0px 3px";
    pandaClose.style.margin ="3px 6px 3px 3px";
    pandaClose.onclick = function() {
      scrapPanda(this.parentElement.parentElement);
    }

    var pandaText = document.createElement('card-text');
    pandaCard.appendChild(pandaText);
    pandaText.style.fontSize = "11px";
    pandaText.style.color = "#EAEAEA";
    pandaText.style.fontWeight = "normal";

    var pandaTitle = document.createElement('div');
    pandaText.appendChild(pandaTitle);
    pandaTitle.innerHTML = hitName;
    pandaTitle.style.padding = "6px 6px 3px 6px";
    pandaTitle.style.height ="20px";
    pandaTitle.style.width ="212px";
    pandaTitle.style.overflow = 'hidden';

    var pandaStats = document.createElement('div');
    pandaText.appendChild(pandaStats);

    var pandaSearched = document.createElement('span');
    pandaSearched.id = match + '_searched';
    pandaStats.appendChild(pandaSearched);
    pandaSearched.innerHTML = 'Searched: 0';
    pandaSearched.style.padding = "3px 6px 3px 6px";

    var pandaCaught = document.createElement('span');
    pandaCaught.id = match + '_caught';
    pandaStats.appendChild(pandaCaught);
    pandaCaught.innerHTML = 'Caught: 0';
    pandaCaught.style.padding = "4px 6px 3px 6px";

    var pandaPay = document.createElement('span');
    pandaPay.id = match + '_pay';
    pandaStats.appendChild(pandaPay);
    pandaPay.innerHTML = 'Pay: $' + pay.toFixed(2);
    pandaPay.style.padding = "4px 6px 3px 6px";

    var pandaButtons = document.createElement('div');
    pandaCard.appendChild(pandaButtons);
    pandaButtons.style.padding = "4px 6px 2px 6px";

    var pandaCatchBtn = document.createElement('input');
    pandaCatchBtn.type = 'button';
    pandaCatchBtn.id = match + '_collect';
    pandaButtons.appendChild(pandaCatchBtn);
    pandaCatchBtn.style.height ="20px";
    pandaCatchBtn.style.width ="70px";
    pandaCatchBtn.style.borderRadius = "3px";
    pandaCatchBtn.style.fontSize = "11px";
    pandaCatchBtn.style.lineHeight = '1.25rem';
    pandaCatchBtn.style.display = "inline-block";
    pandaCatchBtn.style.color = "#FFFFFF";
    pandaCatchBtn.onclick = function() {
      selectedPanda = this.parentElement.parentElement;
      selectedCollect = this;
      pCollect(selectedPanda.title);
    }

    var pandaAlertBtn = document.createElement('input');
    pandaAlertBtn.type = 'button';
    pandaButtons.appendChild(pandaAlertBtn);
    pandaAlertBtn.style.height ="20px";
    pandaAlertBtn.style.width ="70px";
    pandaAlertBtn.style.borderRadius = "3px";
    pandaAlertBtn.style.fontSize = "11px";
    pandaAlertBtn.style.lineHeight = '1.25rem';
    pandaAlertBtn.style.display = "inline-block";
    pandaAlertBtn.style.margin ="0px 0px 0px 6px";
    pandaAlertBtn.style.color = "#FFFFFF";
    pandaAlertBtn.onclick = function() {
      selectedPanda = this.parentElement.parentElement;
      selectedAlert = this;
      pAlert(selectedPanda.title);
    }

    if (fromInclude == 'include') {
      pandaCatchBtn.value = "Collecting";
      pandaCatchBtn.style.border = "1px solid #7a3c8a";
      pandaCatchBtn.style.backgroundColor = "#9D4DB1";
      pandaCatchBtn.style.backgroundImage = "-webkit-linear-gradient(top, #9D4DB1, #5E2E6A)";
      GM_setValue('Collect ' + match, 'collectOn');
      if (howMany === 'Many') {
        pandaAlertBtn.value = "Alerts: Off";
        pandaAlertBtn.style.border = "1px solid #544293";
        pandaAlertBtn.style.backgroundColor = "#6D59B4";
        pandaAlertBtn.style.backgroundImage = "-webkit-linear-gradient(top, #6D59B4, #48358C)";
        GM_setValue('Alert ' + match, 'alertOff');
      } else {
        pandaAlertBtn.value = "Alerts: On";
        pandaAlertBtn.style.border = "1px solid #7a3c8a";
        pandaAlertBtn.style.backgroundColor = "#9D4DB1";
        pandaAlertBtn.style.backgroundImage = "-webkit-linear-gradient(top, #9D4DB1, #5E2E6A)";
        GM_setValue('Alert ' + match, 'alertOn');
      }
    } else if (fromInclude == 'notInclude') {
      pandaCatchBtn.value = "Collect";
      pandaCatchBtn.style.border = "1px solid #36658c";
      pandaCatchBtn.style.backgroundColor = "#4682B4";
      pandaCatchBtn.style.backgroundImage = "-webkit-linear-gradient(top, #4682B4, #1D517B)";
      GM_setValue('Collect ' + match, 'collectOff');
      pandaAlertBtn.value = "Alerts: Off";
      pandaAlertBtn.style.border = "1px solid #544293";
      pandaAlertBtn.style.backgroundColor = "#6D59B4";
      pandaAlertBtn.style.backgroundImage = "-webkit-linear-gradient(top, #6D59B4, #48358C)";
      GM_setValue('Alert ' + match, 'alertOff');
    }

    var pandaSettings = document.createElement('button');
    pandaButtons.appendChild(pandaSettings);
    pandaSettings.style.textAlign = 'center';
    pandaSettings.innerHTML = "<i class='fa fa-cog'></i>";
    pandaSettings.style.backgroundColor = "#6D59B4";
    pandaSettings.style.border = "1px solid #544293";
    pandaSettings.style.backgroundImage = "-webkit-linear-gradient(top, #6D59B4, #48358C)";
    pandaSettings.style.color = "#FFFFFF";
    pandaSettings.style.fontSize = '12px'
    pandaSettings.style.fontWeight = "bold";
    pandaSettings.style.borderRadius = "3px";
    pandaSettings.style.width ="20px";
    pandaSettings.style.height ="20px";
    pandaSettings.style.padding ="0px 1px 0px 4px";
    pandaSettings.style.margin ="0px 6px 0px 6px";
    pandaSettings.onclick = function() {
      selectedPanda = this.parentElement.parentElement;
      editPanda(selectedPanda);
      pEditModal.style.display = "block";
    }
    //GM_setValue('Queue ' + match, 0);
    qLog.push([match, 0]);
  }

  var selectedPanda;
  var selectedAlert;
  var selectedCollect;
  function populatePandaCards() {
    var i = 0;
    for (i = 0; i < pandaCards.length; i++) {
      var name = pName[i][0];
      var match = pName[i][1];
      var hitName = pName[i][3];
      var howMany = pName[i][2];
      var pay = parseFloat(pName[i][4]);
      var limit = pName[i][5];
      var queue = pName[i][6];
      makePandaCard(name, match, hitName, howMany, pay, queue, limit, 'notInclude')
      closePEditModal.onclick = function() {
        pEditModal.style.display = "none";
      }
    }
  }
  populatePandaCards();

  function editPanda(card) {
    pEditMatchInput.value = card.title;
    pEditNameInput.value = card.value;
    pEditPandaMenu.value = card.getAttribute('howmany');
    pEditLimitInput.value = card.getAttribute('limit');
    pEditQueueInput.value = card.getAttribute('queue');
    if (card.getAttribute('howmany') == 'One') {
      pEditQueueOptions.style.opacity = '0.25';
      pEditQueueInput.disabled = true;
    } else {
      pEditQueueOptions.style.opacity = '1';
      pEditQueueInput.disabled = false;
    }
  }

  var pCards = document.getElementsByClassName('pCard');

  function scrapAllPandaCards() {
    var i = 0;
    for (i = 0; i < pandaCards.length; i++) {
      pCards[i].remove();
      i--;
    }
  }

  function pMatchSearch(match) {
    var matchLogged = false;
    var i = 0;
    for (i = 0; i < pandaCards.length; i++) {
      if (pandaCards[i][1].toLowerCase().trim() === match.toLowerCase().trim()) {
        matchLogged = true;
      }
    }
    return matchLogged;
  }

  function addNewPanda() {
    var name = pAddNameInput.value;
    var match = pAddMatchInput.value;
    if (match.includes('worker.mturk.com/projects/')) {
      match = match.split('projects/')[1].split('/tasks')[0];
    }
    var hitName = match;
    var howMany = pAddPandaMenu.value;
    var pay = 0.00;
    var limit = pAddLimitInput.value;
    var queue = pAddQueueInput.value;
    if (
      match !== null &&
      match !== '' &&
      name !== null &&
      name !== '' &&
      pMatchSearch(match) !== true
    ) {
      pandaCards.push([name, match, howMany, match, '0.00', limit, queue]);
      GM_setValue("pandaCards", JSON.stringify(pandaCards));
      makePandaCard(name, match, hitName, howMany, pay, queue, limit, 'notInclude')
      closePAddModal.onclick = function() {
        pAddModal.style.display = "none";
      }
      pAddModal.style.display = "none";
    }
    else if (
      match !== null &&
      match !== '' &&
      name !== null &&
      name !== '' &&
      pMatchSearch(match) == true
    ) {
      alert('Please choose a unique group ID for this panda.')
    } else {
      pAddModal.style.display = "none";
    }
  }

  async function updatePanda(card) {
    var name = pEditNameInput.value;
    var match = pEditMatchInput.value;
    if (match.includes('worker.mturk.com/projects/')) {
      match = match.split('projects/')[1].split('/tasks')[0];
    }
    var hitName = selectedPanda.getAttribute('hitname');
    var howMany = pEditPandaMenu.value;
    var pay = parseFloat(selectedPanda.getAttribute('pay'));
    var limit = pEditLimitInput.value;
    var queue = pEditQueueInput.value;
    if (
      match !== null &&
      match !== '' &&
      name !== null &&
      name !== '' &&
      (pMatchSearch(match) !== true ||
       match.toLowerCase() == card.getAttribute('title').toLowerCase())
    ) {
      await scrapPanda(card);
      pandaCards.push([name, match, howMany, hitName, pay, limit, queue]);
      GM_setValue("pandaCards", JSON.stringify(pandaCards));
      makePandaCard(name, match, hitName, howMany, pay, queue, limit, 'notInclude')
      pEditModal.style.display = "none";
      closePEditModal.onclick = function() {
        pEditModal.style.display = "none";
      }
    }
    else if (
      match !== null &&
      match !== '' &&
      name !== null &&
      name !== '' &&
      match.toLowerCase() !== card.getAttribute('match').toLowerCase() &&
      pMatchSearch(match) == true
    ) {
      alert('Please choose a unique group ID for this panda.')
    }
  }

  function addPandaFromInclude(rName, gid, hitTitle, quantity, hitPay, maxQueue, searchLimit) {
    var name = rName;
    var match = gid;
    var hitName = hitTitle;
    var howMany = quantity;
    var pay = parseFloat(hitPay);
    var limit = searchLimit;
    var queue = maxQueue;
    if (pMatchSearch(match) !== true) {
      pandaCards.push([name, match, howMany, match, pay, limit, queue]);
      GM_setValue("pandaCards", JSON.stringify(pandaCards));
      makePandaCard(name, match, hitName, howMany, pay, queue, limit, 'include');
    }
  }

  addPandaBtn.onclick = function() {
    pAddMatchInput.value = '';
    pAddNameInput.value = '';
    pAddPandaMenu.value = 'One';
    pAddQueueOptions.style.opacity = '0.25'
    pAddQueueInput.disabled = true;
    pAddQueueInput.value = 25;
    pAddLimitInput.value = 0;
    pAddModal.style.display = "block";
  }

  function getPandaFromOtherTab() {
    GM_addValueChangeListener("sendPanda", function() {
      var pandaStuff = JSON.parse(arguments[2]);
      var rName = pandaStuff[0];
      var gid = pandaStuff[1];
      var hitTitle = pandaStuff[2];
      var howMany = pandaStuff[3];
      var hitPay = pandaStuff[4];
      if (howMany == 'One') {
        addPandaFromInclude(rName, gid, hitTitle, 'One', hitPay, 25, 0);
      }
      else if (howMany == 'Many') {
        addPandaFromInclude(rName, gid, hitTitle, 'Many', hitPay, 25, 0);
      }
    });
  }
  getPandaFromOtherTab();
}

if (windowIsOnAutoCatcher()) {
  var favi = document.createElement('link');
  favi.type = 'image/x-icon';
  favi.rel = 'shortcut icon';
  favi.href = 'https://i.imgur.com/jsju8Wy.png';
  document.getElementsByTagName('head')[0].appendChild(favi);

  /*
  document.addEventListener('contextmenu',async function(i){
    i.preventDefault();
    console.log(getQueueCount('3RD8NRGZKIU5TYSR6V4PYD5BBOXYVL'));
  }, false);
*/
}

if (window.location.href.includes('ahcpanda?')) {
  let urlstuff = window.location.href.replace('https://worker.mturk.com/ahcpanda?', '').replace(/%20/g, ' ');
  urlstuff = urlstuff.split('&');
  let name = urlstuff[0].replace('requester=', '');
  let gid = urlstuff[1].replace('gid=', '');
  let title = urlstuff[2].replace('title=', '');
  let pay = urlstuff[3].replace('pay=', '');
  let quant = urlstuff[4].replace('quantity=', '');

  let sendData = [name, gid, title, quant, pay, 0];
  GM_setValue('sendPanda', JSON.stringify(sendData));

  window.close();
}