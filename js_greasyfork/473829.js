// ==UserScript==
// @name         Avatar Uploader
// @namespace    https://drawaria.online/profile/?uid=63196790-c7da-11ec-8266-c399f90709b7
// @version      2.0.1
// @description  A simple Avatar Uploader
// @author       ᴄᴜʙᴇ
// @match        https://*.drawaria.online/
// @match        https://*.drawaria.online/room/*
// @icon64       data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAPWSURBVHhe7ZjPaxNBFMff5oetWOvNKqJYmyCCQjXqH6AHRS8eBc81FASpbUHwIN4KjfUiaNSr9/bg0R70JoYKFjwkTQsiojfbSqslu37f5KUkadLdabJN4s4Hlpk3P7KZN+9XQgaDIdBY0tYlHo870u1IstnstmcMSRtYjAKkDSzaMcDNp1qN7vc1LiBtYDExQNq6uPmUbp3gdwwxMUATowBpA0vDMaDdMDFAE98tQDdLVNPo+4wFuGAUIG1g8T0G7DYmBmjScgtodpYwFqCJUYC0gaXlMaDZmBigScstQDcLuL3fWIAmRgHSBpaWx4BmY2KAJr5bQLOjvBvGAjRpGwU4jjNdKBT6RNwxfOP8RKPRrnA4fFKG69I2LsCHz+fzP0XcNXxXgC75x1TxvhOjtb/j4kPqtnto2ArRLew4jVVdMlXEoT8Ym3dseh1apWf9j2hdZiroyBiQTdFRZz99wOGnICa2HJ4pjiV4Da/lPcWJStrGBUqfW88CYrHYXC6XO4eb7+IDYfSMWuARx6H50ApdqLaETrKANB6HzV738IxlwU0OYG8VHaOASCQyy63y+Uqm99rUx5ZS/jjrdAi3PiNrFJCr93aOCyQSiWgmk9nIp2DCZT5v4/Cxcdpx9vBdAbq4ZYFmK6DzsgBSm/QUoRClv0/SQRG1adgCvJp4CTcLcrOAhUkakfS3Pf9rHcCHweE+i1gfj3WAbwoo1fZ84+WPTO8YvskC0XVPSiiBtBkmesPVo4xs4psCbNtO+lXbx8foq7VCF2He9yBmlLm7ASWoGqKKhmOAGwsp+osiJCoiLdvUMzhOv0Ws4NMk7esN0aqInLc3BsZoj4hacGBcQ4BE90ZxRJFBTDkvfYXvMQDaWpKuoteiy9LdQo25ir06HEZqRIGUFLEI/2iqwncFwHxUBVcC8sRCGkVpFWrMogkRS1Ts9QPfXWAxRWdtmB7cYHMfTPsLhPvLDr1lWW5+AitOscxgjYPbSfSP0ZwMKZAmP6JJFCW1bgYRIDnwgH7IkMKrC2grQAPOuzEo7BviwAsoYKg47A0c7CX8/zbefwRiDlllBL8Gny9O0Qjm3OuAGnDQHBinJyIq/HSBbnzpFHeiFt2F7b9Xo17AWrWHu8XP4PTF/mzRL3oGBVRUg55A2lQ1RBW+xgDLsm7id/zwsVFai1h0BXX7KzZtmd4Cz/HN81rew3v5M3gO7SCsYYjrALjUNT6Q2uQFrOXaoVY16KcLlLBxqjswX6V9iQlJvPgSPvg4j6G/hP4sbiNd8nk5/FN0yy9pDc9VuNW7Zv0lZjAYggzRPwdv42CLMor1AAAAAElFTkSuQmCC
// @grant        none
// @license      GNU GPLv3
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/473829/Avatar%20Uploader.user.js
// @updateURL https://update.greasyfork.org/scripts/473829/Avatar%20Uploader.meta.js
// ==/UserScript==

(function () {
  function uploadToAvatar(img) {
    fetch(window.LOGGEDIN ? 'https://drawaria.online/saveavatar' : 'https://drawaria.online/uploadavatarimage', {
      method: 'POST',
      body: 'imagedata=' + encodeURIComponent(img) + '&fromeditor=true',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        Accept: 'text/plain, */*; q=0.01',
        'X-Requested-With': 'XMLHttpRequest',
      },
    }).then((e) => alert(e.statusText));
  }

  function avatarUploaderVisual() {
    document.querySelectorAll('label[for="avataruploader"]').forEach((e) => e.remove());
    let input = document.createElement('input');
    input.style.display = 'none';
    input.id = 'avataruploader';
    input.type = 'file';
    input.addEventListener('change', onchange);

    let label = document.createElement('label');
    label.style = 'display:flex; text-align: left;';
    label.className = 'badge border btn-outline-primary border-primary';
    label.innerHTML =
      '<img class="playerlist-avatar" src="https://media.tenor.com/pOv7SnZx7xAAAAAC/upload-cat.gif"><div class="playerlist-name"><span>Upload to Avatar</span><br/><sub>by ≺ᴄᴜʙᴇ³≻</sub></div>';
    label.setAttribute('for', input.id);
    label.append(input);

    function onchange() {
      if (!this.files || !this.files[0]) return;
      let e = new FileReader();
      e.addEventListener('load', (e) => {
        let a = e.target.result.replace('image/gif', 'image/png');
        uploadToAvatar(a);
      });
      e.readAsDataURL(this.files[0]);
    }

    document.querySelector('#playerlist').before(label);
  }

  return avatarUploaderVisual;
})()();
