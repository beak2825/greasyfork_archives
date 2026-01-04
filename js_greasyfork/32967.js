// ==UserScript==
// @name         Greenroom Improver
// @version      0.1
// @match        https://crescentschool.myschoolapp.com/*
// @description  Read name
// @namespace https://greasyfork.org/users/151726
// @downloadURL https://update.greasyfork.org/scripts/32967/Greenroom%20Improver.user.js
// @updateURL https://update.greasyfork.org/scripts/32967/Greenroom%20Improver.meta.js
// ==/UserScript==
var imgSrcs = [
    "https://lh4.googleusercontent.com/ak7suucaH8oYkwzzDRhYt6T8iZ6gn2KQu_n5YmZPwJ2LKoA3AVsZxgVCejE8c550P04zfrBdb-B74Zk=w950-h930", //Academics - Upper
    "https://lh4.googleusercontent.com/URZYP3x_eQGjDmcBlPO9tM-xNhp41PQUnZYn1TfociFvfmocr8wQI9E_qZCWARGc676L-H5rc3qiOsA=w1920-h950", //Athletics
    "https://lh5.googleusercontent.com/4wXAruH1z6Hu38TSEEsXSjX0wNO-BSqTRnN5omN6dhPtdpa9XXbRAvA-e6SOkvkUJjzbSi7bFt-LWaA=w1920-h950", //Coyotes Den
    "https://lh3.googleusercontent.com/L6OCugFE2_ySRp0jM09qLZLw0AFy4Ph04sU9wVDWqQ6QHny4urBFiGgOF1SiOcbpTOdUxt83D_4bzTE=w950-h930", //Email Access
    "https://lh4.googleusercontent.com/m1r4lAya3ggsvjtvWsXcsQ1YvLQaLnbzaLQEseTrnU1L0tvm48MpfBVMmAzQ1l7ZmXnzNXJyJtjUQlo=w1920-h950", //Naviance
    "https://lh4.googleusercontent.com/4EtSQSgxRpsDOWl06kPF1oIG-xUoQx0Ivb0RHOLyj7yBZfKIjxnRHF6d_9odyruefjC78qXU9XYjOQc=w950-h930", //NetClassroom
    "https://lh4.googleusercontent.com/lymOQ4H2IT7qbs3cAE3sw0pQuja6C_mAosOt8yNkXsT4nGgekx8lqhSjHJ0mI7hwmnQOoR7B6eAhobA=w950-h930", //Outreach
    "https://lh5.googleusercontent.com/6LOEpSkrhbSHca5pJUgl8l59iD_ZicAn-I_vpm0h9b4k67ITZOtArNFDhiRqcMwxFdovqqN1VEvWAio=w1920-h950", //Photo Gallery
    "https://lh6.googleusercontent.com/FcCr5xxlFWoTBigMFQyB0-LdSkyOhDCMtLLAVXxahjeyShRnauLIKz6MADxTPWQRf1lc-3dO_kJ956g=w1920-h950", //Powerschool Learning
    "https://lh6.googleusercontent.com/BDNDvouZirN-wPag5H2MJriHzHwgZw8GojM_lnY1vWvrr1zyNUpUHW5QraXWlMGqkzAvwgt_uv_9XAk=w950-h930", //Publications
    "https://lh4.googleusercontent.com/OEdhU79VvBqUsuBEOUVWzscQij0djpJ9wZRljgN84u5Li4ZbHF_t7legSsAzv1rSOzWQBulNl9wZjGA=w950-h930", //Server Access
    "https://lh3.googleusercontent.com/0p2dJZaK-d5R5ijrNYAr9urCvNmYjfNgBmH7iwM9J16w2Kru1SYLJWMfUHqUJYcSAI_7W5Nl3xPWuo8=w1920-h950", //Student Leadership & Spirit
    "https://lh5.googleusercontent.com/riRUdgCLtp8LoZr4gZJrUPQnxlhOSHafgItfJK_6AluPzORxE0JpDkqf8L9QB-DHQGSdDH_5Hi6pRLA=w1920-h950", //Teams & Clubs
    "https://lh6.googleusercontent.com/rDRYy3qPC-4agYNoSasa2ZIfxm9TGgKqWlDd_ig5tUrldlLrBNj6ljIThXCxVgHudAHAMa3ZrOr0m1I=w1920-h950" //What's For Lunch
  ];
  var jsInitChecktimer = setInterval (checkForJS_Finish, 111);

    function checkForJS_Finish () {
        if (document.querySelector (".wBtn")
      ) {
            clearInterval (jsInitChecktimer);
          var x = document.getElementsByClassName('containerFull');

          for (var i = 0; i < x.length; i++) {
        	   x[i].getElementsByTagName('img')[0].src=imgSrcs[i];
          }
        }
    }