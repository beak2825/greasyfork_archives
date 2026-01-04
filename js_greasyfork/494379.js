// ==UserScript==
// @name         Scicy
// @namespace    http://tampermonkey.net/
// @version      1.0.2.1
// @description  chaoyue
// @author       chaoyue
// @icon         https://sciener.netlify.app/local%20library.png
// @match        https://www-degruyter-com.2419.top/*
// @match        https://link.springer.com/*
// @match        https://www.techno-press.org/*
// @match        http://www.techno-press.org/*
// @match        https://www.science.org/*
// @match        https://www.tandfonline.com/*
// @match        https://www.sciencedirect.com/*
// @match        https://www.annualreviews.org/*
// @match        https://journals.lww.com/*
// @match        https://www.spiedigitallibrary.org/*
// @match        https://jamanetwork.com/*
// @match        https://iopscience.iop.org/*
// @match        https://heinonline.org/*
// @match        https://aacrjournals.org/*
// @match        https://www.cambridge.org/*
// @match        https://journals.physiology.org/*
// @match        https://ascopubs.org/*
// @match        https://saemobilus.sae.org/*
// @match        https://karger.com/*
// @match        https://diabetesjournals.org/*
// @match        https://www.airitilibrary.com/*
// @match        https://rupress.org/*
// @match        https://www.nejm.org/*
// @match        https://pubs.aip.org/*
// @match        http://www.bzfxw.com/*
// @match        https://www.bzfxw.com/*
// @match        https://journals.aom.org/*
// @match        https://ajp.psychiatryonline.org/*
// @match        https://focus.psychiatryonline.org/*
// @match        https://neuro.psychiatryonline.org/*
// @match        https://psychotherapy.psychiatryonline.org/*
// @match        https://www.ajronline.org/*
// @match        https://www.atsjournals.org/*
// @match        https://*.rsc.org/*
// @match        https://journals.biologists.com/*
// @match        https://portlandpress.com/*
// @match        https://www.jbe-platform.com/*
// @match        https://www.scientific.net/*
// @match        https://arc.aiaa.org/*
// @match        https://www.worldscientific.com/*
// @match        https://journals.sagepub.com/*
// @match        https://ascelibrary.org/*
// @match        https://apsjournals.apsnet.org/*
// @match        https://pubs.geoscienceworld.org/*
// @match        https://thejns.org/*
// @match        https://direct.mit.edu/*
// @match        https://www.impan.pl/*
// @match        https://www.clin-lab-publications.com/*
// @match        https://www.psychiatrist.com/*
// @match        https://ieeexplore.ieee.org/*
// @match        https://journals.healio.com/*
// @match        https://pubs.rsna.org/*
// @match        https://www.emerald.com/*
// @match        https://asmedigitalcollection.asme.org/*
// @match        https://www.clinexprheumatol.org/*
// @match        https://www.jle.com/*
// @match        https://econtent.hogrefe.com/*
// @match        https://www.igi-global.com/gateway/*
// @match        https://www.jstor.org/*
// @match        https://www.degruyter.com/*
// @match        https://www.jove.com/*
// @match        https://www.microbiologyresearch.org/*
// @match        https://www.journals.uchicago.edu/*
// @match        https://onlinelibrary.wiley.com/*
// @match        https://www.neurology.org/*
// @match        https://www.eurekaselect.com/*
// @match        https://www.jco-online.com/*
// @match        https://pubs.acs.org/*
// @match        https://www.ahajournals.org/*
// @match        https://ascopubs.org/*
// @match        https://www.dbpia.co.kr/*
// @match        https://econtent.hogrefe.com/*
// @match        https://www.icevirtuallibrary.com/*
// @match        https://content.iospress.com/*
// @match        https://intellectdiscover.com/*
// @match        https://www.nature.com/*
// @match        https://www.minervamedica.it/*
// @match        https://publications.aaahq.org/*
// @match        https://onepetro.org/*
// @match        https://psycnet.apa.org/*
// @match        https://www.wageningenacademic.com/*
// @match        https://www.dl.begellhouse.com/*
// @match        https://journals.aps.org/*
// @match        https://agupubs.onlinelibrary.wiley.com/*
// @match        https://muse.jhu.edu/*
// @match        https://archives.datapages.com/*
// @match        https://www.cairn.info/*
// @match        https://www.aeaweb.org/*
// @match        https://www.concrete.org/*
// @match        https://ebooks.iospress.nl/*
// @match        https://jcsm.aasm.org/*
// @match        https://www.dustri.com/*
// @match        https://www.neurology.org/*
// @match        https://www.proquest.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        unsafeWindow

// @require      https://cdnjs.cloudflare.com/ajax/libs/layui/2.9.3/layui.js
// @connect      127.0.0.1
// @connect      wanfangdata.com.cn
// @connect      cqvip.com
// @connect      cnki.net

// @downloadURL https://update.greasyfork.org/scripts/494379/Scicy.user.js
// @updateURL https://update.greasyfork.org/scripts/494379/Scicy.meta.js
// ==/UserScript==






// NUS
window.nus=function(){
        var t=location.href
        var t1="https://login.1413.top/login?url="
        var t2=t1+t;
        window.open(t2,"_self");
    };
// NUS
// Emory
window.duke=function(){
        var t=location.href
        var t1="https://login.2192.top/login?url="
        var t2=t1+t;
        window.open(t2,"_self");
    };
// DUKE
(function () {
'use strict';

const $ = unsafeWindow.jQuery;
    // 遍历页面中所有的链接 <a> 标签
    const links = document.querySelectorAll('a[href]');

    links.forEach(link => {
        const href = link.href;

        // 如果链接包含 '/html'，替换为 '/pdf?licenseType=restricted'
        if (href.includes('/html')) {
            const newHref = href.replace('/html', '/pdf?licenseType=restricted');
            link.href = newHref;  // 更新链接
            console.log(`URL updated: ${href} -> ${newHref}`);
        }
    });
let link = document.createElement('link');
link.rel = "stylesheet"
link.href = 'https://cdnjs.cloudflare.com/ajax/libs/layui/2.9.3/css/layui.css';
document.head.appendChild(link);
let Gmsg = "";
layui.use(function () {
  var util = layui.util;
  var bars = [{
      type: 'read',
      icon: 'layui-icon-read',
      style: 'background-color: #5d9e2b;',},
              {
      type: 'nus',
      icon: 'layui-icon-download-circle',
      style: 'background-color: #5d9e2b;',},
              {
      type: 'duke',
      icon: 'layui-icon-download-circle',
      style: 'background-color: #5d9e2b;',}]
util.fixbar({
  bars: bars,
  default: false,
  offset: 'auto',
  css: { bottom: 200 },
  on: {
      mouseenter: function (type) {
      let C = { 'read': "获取权限", "duke": "Emory大学","nus" :"新加坡"}
      layer.tips(C[type], this, {
      tips: 2,
      fixed: true});},

      mouseleave: function (type) {
      layer.closeAll('tips');}},
      // 点击事件
      click: function (type) {
        if (type == 'duke') {
        window.duke();}
        else if (type == 'nus') {
          window.nus();
        }
        else if (type == 'read') {
          window.read();
        }}});
});
// wiley
if (location.host.indexOf("onlinelibrary.wiley.com") > -1)
{window.read=function(){
var url=location.href
var form = document.createElement('form');
form.name = 'formLogin';
form.method = 'post';
form.action = 'https://onlinelibrary.wiley.com/action/authenticateSharedSP';

var usernameInput = document.createElement('input');
usernameInput.type = 'hidden';
usernameInput.value = '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';
usernameInput.name = 'sharedSPMessage';
form.appendChild(usernameInput);

var eventTargetInput = document.createElement('input');
eventTargetInput.type = 'hidden';
eventTargetInput.value = url;
eventTargetInput.name = 'redirectUri';
form.appendChild(eventTargetInput);
document.body.appendChild(form);
form.submit();
    };
    }
// wiley
if (location.host.indexOf("agupubs.onlinelibrary.wiley.com") > -1)
{window.read=function(){
var url=location.href
var form = document.createElement('form');
form.name = 'formLogin';
form.method = 'post';
form.action = 'https://onlinelibrary.wiley.com/action/authenticateSharedSP';

var usernameInput = document.createElement('input');
usernameInput.type = 'hidden';
usernameInput.value = '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';
usernameInput.name = 'sharedSPMessage';
form.appendChild(usernameInput);

var eventTargetInput = document.createElement('input');
eventTargetInput.type = 'hidden';
eventTargetInput.value = url;
eventTargetInput.name = 'redirectUri';
form.appendChild(eventTargetInput);
document.body.appendChild(form);
form.submit();
    };
    }
// uchicago
if (location.host.indexOf("www.journals.uchicago.edu") > -1)
{window.read=function(){
var url=location.href
var form = document.createElement('form');
form.name = 'formLogin';
form.method = 'post';
form.action = 'https://www.journals.uchicago.edu/action/authenticateSharedSP';

var usernameInput = document.createElement('input');
usernameInput.type = 'hidden';
usernameInput.value = '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';
usernameInput.name = 'sharedSPMessage';
form.appendChild(usernameInput);

var eventTargetInput = document.createElement('input');
eventTargetInput.type = 'hidden';
eventTargetInput.value = url;
eventTargetInput.name = 'redirectUri';
form.appendChild(eventTargetInput);
document.body.appendChild(form);
form.submit();
    };
    }
// aiaa
if (location.host.indexOf("arc.aiaa.org") > -1)
{window.read=function(){
var url=location.href
var form = document.createElement('form');
form.name = 'formLogin';
form.method = 'post';
form.action = 'https://arc.aiaa.org/action/authenticateSharedSP';

var usernameInput = document.createElement('input');
usernameInput.type = 'hidden';
usernameInput.value = '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';
usernameInput.name = 'sharedSPMessage';
form.appendChild(usernameInput);

var eventTargetInput = document.createElement('input');
eventTargetInput.type = 'hidden';
eventTargetInput.value = url;
eventTargetInput.name = 'redirectUri';
form.appendChild(eventTargetInput);
document.body.appendChild(form);
form.submit();
    };
    }

// hogrefe
    else if(location.host.indexOf("econtent.hogrefe.com") > -1)
  {window.read=function(){
var url=location.href
var form = document.createElement('form');
form.name = 'formLogin';
form.method = 'post';
form.action = 'https://econtent.hogrefe.com/action/authenticateSharedSP';

var usernameInput = document.createElement('input');
usernameInput.type = 'hidden';
usernameInput.value = '9OwW1HqCDwAgLhhzT2d1TFwXG8VdWU2WHFoN61yr1+SySqxUHiRHnLmd/VS2A5PbqQjauCf9qDTP1AZaEeWBn/6k3vi/BYp91vnq2nW5k3hZL4/TKEXv1wZCyv/TxKEpgn4ZSOJZEX42Mz0mzwtKsWTrvoNFQJUjR4+b18e3Casp26Kpctq2PoGn+8DUjA5aJMrORaHdYkSDtN5qWgDF0gmRR6LO8jfnheEvBHgawZxfM9wHOszsSIAmZqHz/VuMk1KWqAAwWc6J8wQKiugLOJdZUOm0v0HkKt9q6bz7Fe8vz6RJlkr2QRbUtOaqiumbXZA6Q/A9gzc+wLrd8zoUeBBa6nyNImB3nETfkafhWjWBbeqghAfi4AJtq+03D3trI6uFkkfsMOnZ/JJ0DNw6Kw+ts7brTwnsacLIXTkU9udINGUdJkD2ZxY538YFODdFjJqgx+BBIDCozRFwW+Q6T9IMJTZZKTAEzr12d/1DSBVNNuLagYY59ZNSlqgAMFnOifMECoroCziXWVDptL9B5KMuZ0WDMtmFtaFvhS3iBkQJkUeizvI354XhLwR4GsGcXzPcBzrM7Egr6btDb+PTzCEDG5CxDrq8+czS/KKLsW4fk9EZCWTwvkZOCNlxdexG0z464R6QMqkzwmOUDRH1CH9+J1qEDoGWgaf7wNSMDlpAJKIj2qORqF/4LeRfYQ1SGGLreM8cnlrIkpIik9EuyLttMjg+0ttOE84KI8XqdilbD6whxcbXzSyvf7+wbOOp1AWG/5RzTbZHUoeosKcsrC4DrMG0qsSv9f0Kjb0fUieYDCSfhxZKWOVhXA05D2wOoXZpQMo6ukYtmvqVzhrF0FJsQW/U4JiLO48kzRnjAJ7c54OUeHSyPSI9A5xpqVeqEq5KIbez6hfbYmnUGTSnsyxWZ2Kzd08OWWgHz5cz1ninvm12tQldmOCvb2npyJRolLXnsMmwVdzJ/O9peaRnqzA1840giEoXpR9423AEppNua5olQ8YQMovfKHKEBSWBm/QTusBAuljxRU75IACcCNNSdqiTzp/wFYF0Jconzkjy327ECaZA6X41/crOoyO7UmxBb9TgmItz3HBFyr2DNNcWd8NISlUIrRiVmdDihf/0rAKghRwbUifrHpSpx13U6cknVKzp4k/EZ754FdL//FGj+PKHlJqhKY2O+lQ4yMgCEtP1lRCcpFJXoiGl1Xy1w0SMHNfJHqmTUpaoADBZzonzBAqK6As4l1lQ6bS/QeSbd/Ay/NXJPfF9eM4a74txD70SaFWv6PR/VzKV1XCewMqUxhLPk/dDsYNWu2ufzeUJkUeizvI354XhLwR4GsGcXzPcBzrM7EgF9g2Uq35DvGxcBD95pp6VQBC4Nl9Ae1lm/PvSTsvBlR+T0RkJZPC+Rk4I2XF17EbTPjrhHpAyqR6taW11JPC/C0mZHFb2DM03ww8wPD3J2hduyhXESkk4CZKkbY2esLYhiuHLT/EP5wK+2P8KwpkmpsVqqjPGPd/xfXjOGu+LcQ+9EmhVr+j0f1cyldVwnsB+7akQcV1FTHBPEiLKASXck1KWqAAwWc6J8wQKiugLOJdZUOm0v0HkNFmfb8KepNHoYmtdrKonSHPlbA7hYprQFtS05qqK6ZtdkDpD8D2DNz7Aut3zOhR4bB5u1GkA+raw60gD+xhuwXiURnjELK0OnqYzXpDQZQqkO7HLU2VNp0wiDcB7ezXL47DjIy/q0Ovo6oWjeef33ZUTt+IRifU/Z2Q6vzquLX/QN3QY7KVwALeBaIO/YgNQN1gSFwSk3HL24AtgpISGaOxYXqy+AaYXUaP48oeUmqEpjY76VDjIyAIS0/WVEJykUleiIaXVfLWaRq7WYbaPgYMTIzA17rKChDgtDuW3pVdi+I4FYRTxzVC8xHanUXXYCfdhNUolpMdM8TaltcHk988R/5m0aZGaBhjKGjbrfs0tbnzlHsH9NERLF2hqEC0w4ogoITURxCmOz00oWH4IXDuJRjAAFc6hlEBEVMitvXtKJHJ9rEb7OwCI+dxUmrS7HTL2iT+wHoT71xvL/yD4GUpdwPEnHCIyvHWM3xhH+I+PlTRE6fiCHnklTENUq98iJRCmvkOJg2gtxinJj1uQcFqbYkrNLKm0zttvgYwr6XaqXs1edg2tSVihWxzz3Q10Uqw8PB44cmaAsNMCBvU/+JoklEJkzN1QgBthmSt6/PQYMgaW0R0zoufdg4pZmbX9AtHaOvC3Eu9FqT5UBWVqFxYImuHvwo7SLTp9SJ0Q15YxE2tZheXDXiltSrY4ogvQlK0Rf8e9gwMGbZooiHVmRV6/qodRDXPjq51BsvpmYFaJTTt9J9NgXiXiDt9O0HY4/EuTfk3Yx1DecoEy2PEUbLxuKEfcLhH5O7nNua7Qhz8sO0GWUM3HF0RKKV5j68JdNiiqL+BPa6hrwy0kHcMEeuiTh+yuVN6ZZ32Adf3ICxVw0N9dR7FnFOUsY2uTmCNtj5U0ROn4gh6V46KPTM+gFZit+hDdlx1hCgnDB0GXXOs+oI/1wmUWdVN90A/eiM9046z0FhFLzXq6rHNZ7X53vyScssf37TwVyQlTiayBdY9FJDq9p569Oc2/j1p30VokpQX2hMOjv35bqaG+FzHQQYJJxJ6r8sbNEEobCeftcfSV46KPTM+gFb9Sj2BvPTDrj5U0ROn4gh6LzuWC/JLZMwU+uQzCcoc4WBdHALzG1Zcx0rAA3RbarEaGCj2eqIH51QiNIJsIeDSq7U9yslORB/7hY+wfvDRFKDivQvEtkw/J2oxXvsv70rOjB50tvagRF6o/ji+gQu0PKnypgMIpmPX3Y8APys7IlJP+ZTnXPtCyjBaPfQLm/aLlFstWEvuE1/q1DdHnDjmF9fiAyYj75YzCPbN17p6LyfAyKoyLZaFTmtdaGoyGOlb3ufs+4wzyHqnxk1HHhnGBde4owIKW1Oqgut0Cd+xKS885JQsRIkRDcrzBJwPRrGbbhGb3ErP/AT/sKW6E+UGdck2yAeTaeiy3p0aiaPrFMLuj6oEoN/Zq3bP6iM/DRYbhHaPO8Bzfr56SuLMDi/EOIURxC9sAj/cmgweDnlOHQCypGNyaDfFxq8gU3VZTAmd5CVlsHKGpKaRUNRkniGjUmIHUuz2Dx5Gun4DcofWXe3FkHPH0fxYOIURxC9sAj1vhJh8jaZCgRStMMzVg32zwmgn2k2vCx9tijSwOQlaaA1/Ab8bkGVV8JEmgXA0L0KurW50bOFF5TIRW+x22VSECCTv8WqhQRLD0spXl5CNK5DvPzgy2JFUWpK80Ut/VbFqilY94gihEP+KIczNc6EdaXy8AavCfRA8qfKmAwimYdtGt6lUZv09Mr4g0HnfM25Xr9yxMuCkREeu22lFp+r00muNpNK2nFqCNxqZLkJ5fcy53dcCr1prZT5Usz/FWWeShpP+GoRGOLShG3HBqDqhEoBhtDUulEEUrTDM1YN9s8JoJ9pNrwsfViLV35uYAVAb7Fry/TMRmi8A+MFjotBzYukbC+VT3BTHSsADdFtqsRoYKPZ6ogfnVCI0gmwh4NPl6VG2uwZ1FDNETR0uQ/QKvnpK4swOL8Q4hRHEL2wCPuiUqyGuyq8ABinlpkmRH7qICFWObe7+pEgiEv4fu5Qay9KgKwi+K6kzeuYjnPT5mQrxkers9KhBj4EQOOjK5U6snjliVoR2NvXHefFxVfMqyEyV03JhAdKf94lMfP//ZFjc5v78sb4dsum0ZpcsbTlddW4Cm0K1MLShG3HBqDqh/NGZYgtYN9GwfYpsaVpkM8JoJ9pNrwsdw51CXwvMu7LUkmNDdDQlNp/3iUx8//9kk8LCQy0YNrFkc3Sf7//vui1hMO40AOD3LNgQhfIf6aTr7JlYeyD65NZE/HVKAv+mGrb6RmK24T9B/4sWwzS5Pi1GicYJv9rltrxDzoJJMxeq8ceBYtWXYdtd73AAWmo4SjebSZ5C/NRpnR053EHS5V/JONMEidwzyo1htBrrR56F3kSnfL5392RGx1UgjRdgRlgzjl2ccnZWpt5iCT/8bnDtsYqFFYMVfKBFhMsxwJQnBkJNrgUnq+A7pvfpyAdqJE2J2jYKjhU2uquS/3FaHgZB8CJte5knHwqng5Cf3QckKAZ98uAr5ARDlvGCRDCd1CInWJ7UvXi0TZDHrCPGlIzOb3ARA7D75LdEG6xF/QPV+E897KaXrdvByEFjO+SvGcKrwSZdoncYzc0hlIeLbqxwrKt1ub9hXKt9Yjx77yFpHr40ga3d3H2fO7SFIkA3dtQCZ23mhJhTnnWPHHn+ZcdKC0DkixnGLBQMl0GawwLUkmNDdDQlNp/3iUx8//9kWNzm/vyxvh+fe7kkLbslTV/SYJrD4SGaBde4owIKW1M+XYGlbTe+5fWC6x2bt4UwPKnypgMIpmGgCH92K4UKEQD9KjFpINmEuOldQLPgbuXh1lXRyg8zzXkjbMqE4wVP06wXfCwFXF8NP+4RXUnGuniXUSG0RJp3zkqjOZqSrU0orrup5ldOIYAYtaQucFCNDY3KgO6zuyBN06jkreuFv1MlcHhXHRlLYnEO0Km7f+SXWaZLYLmvwAuo0oXZx1kw0dUzo0chman72ZflJfXlzPtnhGXo+KNMPGXX3qoZMMGC8ruIKnnJ5FgTB6EPJf7Yq9kIZdfZp7I8xxf/yTcBvh5KgOZ5jL0ssICsmzpvz63iDVypWv3ko/OBZv/noDqGhuqUwuUpSkIzO7X8UOjumtpLzuKRK6cb6ReMOtEsSMOSI3MTRF4cDRDYlaB5vP0meaidm5nD1m0bkmmLTGfh/ePDSMOKgUtz9QnVDaLQdLMpUGJOn+cU2viWuwHsOJLcnd9o+O7cQR/v/M8WpHmjChHvsULrE1Yec8odng6iFioSkgSkbKghMLpT8Y7ebPE9IMyLNtocNdWmEheEqMpiL+fs6B6zzzhDbu1RGVAPEmr2NWRa0lrKDn86p9mH1WkPGa0UJTHKYr/hvBFhEdAfh2vbbTR8Kh9s3EKrE6I0Xwhim0T3P+anUWV6Xnt94RsEoz6jq54Ikat434VRZJ/TPHTSUB7D7b3REkV7B5R4t2/+ceo+HjSoK5cI+KFJI3nhUSEqJUe0G67IRHqTEobY93i3tYGpdbHJoLwbw7ENuIK52WdvrPu+0KJmqfmsb/HmQ1sMaTnXP7nNpUyYVSIbvxDHzqy+eYKoyxcOrDeiwwxMbLagAkBGiSkGB9GJIFJnbY2s2HaWUSvuHbouTlShZ/PPJGZ78lZikGi0z9vefiJhAW3JSN6bH+7WRFcjnjWZpn0fbR90YMYew+ze2lv84x3Mw9ZkO6tIHE/BfR2wm3KD1M+XVMGTJMnS8Xo5QrPrmpNtPzcCcwnHQQy51dLhv6HLrvnUkczq6cB5CABk1dz7cbgaHZ6dv9HQBMCc1spCy7An5+Zya+BSSyBBeKNcrlgQBlhAJC62WTI6iYUl7lWic1OvEWxdhe17GQYGdTZCwGvbjH3gafeGBrVPrOTaYZ9zJw77fTdF/O4CVgHaDIdGME/Wq/SbRY+fZfdyMHz47anAqdgChir9wizYUfYLY8lIZEVvfGitAR29EiEl0lAO3/TaeJXm7XrYwhcRpu1fESiwSOYfECuv9f0uynxrLtusuKKmx8q2nxtN2r0NSxG50U9ZajE/vqZm35ILZLrawrK2cO2GA+3AHswxbAfr0Yflu0Gu1u619cak44VwWeVOer5WiENH3fuafjbO3YzVDo5P/m0i88F/NLjK5ORwKQiBWINTgEAHCsKzCGEaZ4HIbZG8GU8F8+pEpeszKRQ11y8DMdfT/bMGUO59ZUazh0kYa3tOJRBoSf8e7ILppI4NYGSqzBFAMwmud6XH3lXfRqwx/vMGmPvdvXT4QqxlXMcCSmiSTZ01IaYjMo2fhIRh2cKdVViAWBd6akrGbWxbtYZ/hadsYiIl1tgfTwwN8EmaHkZ93Kjks2rfZM2nttsvRTNOYw5yZNH4sVU8TLTEi9RfRC5PH5iPtF2yMuGILb9+A1AW6eyFh+Lfz+lN5C78hMY8FPQnghrnnn65Q8jaamskHXC0qOTN/5sYT4HUQzWHfLZLnlWOeH9M2i10jG2OE6Pr1ALSGaWog0cKRo9kIoAlZw4EJ8QuGzII0+s++MIv1YAVjrK3S/RsfDCMbtYE60RGteLILcZ51bjBdDLCyS5lFM1x2A5x4wSU4qYyNLlpu0bPYM6l7NNYLOVPUvHhJ4ezxz9VtMyXcwhC9pfkjjpgLTvJzUv7aZj7ScfydbRnjJBX+uNijvN9X88HGce2BuKtkhYFL5btiAAz3JSI2AvZVAOBeKdYaq2eU9G1GtzCizWGqMRATVhHxyGGDLiAGT8P6Qyk3VOmZrujHgMqv+9Q0VnUh/M86GYIIHPtH+jpSvrPZSljGMWsjYs6OuJP0UbNgGTU0M2mmIgNEwoUGJPAOge7HqbO0PUW3gz5uYfwSoQPoOGoHzoc2wbTQbVjxduNvndlzMT5XPfC0fsIW2JBuBuyrOSnUlXYdwYOi16xE5HztFp0H+s5V/fRl9DYaV22KVTWenQGTN6bLcQDs59VAq7A9SIOlFcGmieNVp3W3oeVoKjVcBZpd8NUbZbAtaa60UqSDC9GKLhPL9yf0QkhxUm9Lq+djnNIfvClNWWCTHDNpXWkBhOa/1GXq37SsvkZJUq0CXuc98pW39IS0KfWLevghImcz9kVmxYwCmtxL6lpjVAYIM0rAP0cMj63Xh72dTK6fg4yHN/TNE3xVIpkebMSElvWei42DsFJ1qUj3G7K+559K6bhT/CuW/gCffG7HSu7WMRtErd8T/G5yGF7hkAiEZgRfMrWn23+59GYOZSFsc+25gQrVEYHETh5LfjPHlsZi1ouvfRyRuyELMru+fY99LrGfUralpaRCJJZCA2pPJSrLVfsNHkaw9i18bZKnk/6cOZ9NuvW3fAO0y+S79KjoBC071bj87l8IvzOPvSJierD4iSEVQoMoxWqNpeZQtIwoWnjka7U6IpJuELHktq72ff8yepCFapVJXNNOh259N2Z1jmy4B/QgnFW9gYK5sugzt+cOkaxDX+tt8QPDxBvzq/OWu4zFKDahpxd8P3ustcu02xJuXAmlauJWIMOsDaZyrfAeQppI+E6CTkz6CJDE+iWLN/xmzkph9Sb3jkDwDHFLzoygUsC8J2Vw7aJOaETGC5irNLDBDj1OXyvf3od9GoRghVCaZcF2r+lubTyEoKKO5prXSWoqsb57kgzQOETMRMeDD1jQEcf2AieeAJAnIOZV07dRqh1SkhGN8gCMF0dRemVQul3VBd1aK4uj3Ym/yt7b7+Px6fK56de4X315qeELghqhe0HdO0lsBF4ibcahFG5wA49o/f6vtDoQ4MA0nq8sfM+r1b5RclFIjr5xgABgVG92WIN0SVRQ+8Va2vLyRVWG0diFtQKk4qMbwWjI76dh7PzVZKcRmP/eKyIwGVJqN6zs2cn9vP5I65c9BfwI38By1ZpQESYUsirRRA7Cr6DRuhH3SjeiVbOb4PuMcJ7jYG5IQlkKm+wAA2lDj5f88DNS3YDYkHJQ15q12v5DdYImr8Owx4xbE8djaacmnGl1nwpGhI9LjJ69SsNIlmCwFptIhcXfDgGw7Y1qSDnt6Whd5MoFu7KgB79H5dH2fx4w7CfV6WqxFd1Nv+dyWq4uYB/MzaA46OzuIl0+hKIfMWw7U9LYdPdXQeg0/8z4MhDNkps59aZelRf8kfTIg74Rh64LKdOWrNWSuOkPfV7jvgV4NZ4WRGMle0axVz+KRALZnuRjI1oRjZov4zju/EBqRNADU6s7P668xXsGZ340cbMKZJCUMi54KPfBHqxBBwbuJzpzluFRvtzNKhEzt/yX3KrwKpcORPzL8s0ujwTqg2PtrIjNiC7/Wtb3w88jdCWyKZ14nGm2wlEHHpTGvKMpvcet5dG6w3u62w87DnbBT4nZwMpORxJ6qD613cr3AlrgtkLYczYgDHalIDtA0fZeKJDVQKE8IBOius82OefgZhv2OID9Owmc01N+tURsJBOius82OefgNq2eCacBKfoXqj+OL6BC7b1x3nxcVXzK6qC63QJ37EoiRMYr1BxuLPZ2TjyfeaRGlPpxR9o3v8CANq9dd3penI+VNETp+IIegXNTetfC8EMTXbZ2LY2fp/5kUSqjgO3+9kLGWZp912G9kr/0j/bLxnvDVRUpBYKenrIyekxctkW/w2Iefriq+7nVXx+UeSm0Wbf2FhkUjJePlTRE6fiCHsrgSUe/tHe0/87hsWuXsOktKEbccGoOqNMqgH5Mcb6wM/Y98XKuLxRPzfeXASwYYyC3kNBb9zzvXFdyDKFU3zUv6SIGKj/cus0hX5nx0X6uggG2iYG4yO95p4WzY0lg3VQJp7EkbizZgCCkbPHL31uhSZAtfB+ndfceQ8b+920UpgaJWhsCmGTKFQYGvSBDe4qOCJTQ8xrjQYIREBxowAlw0N9dR7FnFLl+BaepLYzOPh2vUdJAz+COe3j9ksyTnZZMgnwKCR5JOOnU5NrfEIlhUU2N+1+3Di0oRtxwag6o0yqAfkxxvrClElC8z9EhZ98vcMvxDejwFWMla60KOzWa10eylsZWigW/GDXzPS8CHm2OuiRvtnDo+fBY2Byi3eZpmb8AIAM4JhHnT69Rlz/2dk48n3mkRtNM8N9cw+lR0gMzjc2m2RuPlTRE6fiCHlhCgubWO6XQJiHbk03RLTn5Ne9fBxo0O2RB7w7DNaBKef63VVbXhaZSPRRpy7etUGx2Ok8Rw8rmHeoqUoUbf7RIRjuVnYYsm4OVs9Fsdob4w1aNfnt9d9nkL0x7tUmfCxgyBpbRHTOiEl2TjnXbetUzZiNL/Uc853fUg1Laj38ndz8Pm/FM6cqx987bLjH5s9A0MmrIgNaimRsRKTG0YmMR67baUWn6vdHS2SYsyNwHLsZoAlG7393wgVc4oeEX7nYuldq9Qs1PTBYH47QTjISO0f0i9LAVLOb+coqEzIxsImzP0/5E7xW84+813ZQj7agdpGeUOaAgLJ4s+Lj8d+wb6czshexhMBtmUWXmocPGjxzNBYBbCqJ691HhfoioziV5opaJFgzTTfq0ES12fuywIMbnj6rMs0FvvdYYmivpqO+bOwGNXJFXb8jfmbJeyFJmvtNB9TnUSE6jAkg2mgS8G8S1bl+WOFi3ud/4M+thWht+orRwQ20YKgS1dzr7/Jn21aFZlp6fbbfzcPdFBvI9ImYbnp8rWJRL/8/P295WbywKL3Z0ZRgP62Hk8W7ULv4uvlqBxa3iDWiRHTk+vRpcV3IMoVTfNS/pIgYqP9y6zSFfmfHRfq6CAbaJgbjI7ylke5RGjfnh/NGIWwU4u9qPlTRE6fiCHoJ7VDGhMvBp2J+7eeFekXT/Xo2IW71Vgstc9kMCLuF/omUMkXfelF5Eq2MQZTt0jRDfW1KRXj5hSEUEGiNjSqMWwhgv9e3izLlRs/tOwWIfHeX79peMwidLSPEOg8G3saedzs/bzxXztzK3PhM01bhifYAjt6HP182sbWJAI+FMKz58SxiWuNoHKbynuPmfSVWRNIKVnYJpFiRCWJgQ3PU+oI/1wmUWdRbUtOaqiumbIucDJOldI5qf5pqi5cCbxkh29/SQZ9KJLJ67ayVkCypaXy8AavCfROj58FjYHKLd00zw31zD6VE3mhJ5g8oxdnQ75ooqY5JY8JoJ9pNrwseZ9tWhWZaen28sCi92dGUYj38D/THz/ItQBowm+KeCTc1Y7DJT+wxG6e7Y9kTwOeQnwCOm/cj2Tz6gj/XCZRZ1XChKhRCS3JVDMxq+s9qcD90NZCcWqGHrJWVT8ZXetXOWwNZeJuNJ53DQ311HsWcUuX4Fp6ktjM6whLTDyfO40Y57eP2SzJOdKDivQvEtkw+US//Pz9veVoiVsdHapmfRGceY4I8HrExSL07lWsJIki0oRtxwag6o0yqAfkxxvrDPbhbZGOSPM8ZRt41HEqhn592DilmZtf0C0do68LcS7+lnTe98pN+X+tLDUs9OEAB7bGEcejYnGtzLHBWtrQ5qFYqv8t8dNUCPlTRE6fiCHqwyCTGVNA4VidpiIDYnBykbSS6hllCrHaepmwKtcEK76PnwWNgcot2c6+rSekXK1UPZrQJiy7/HDiFEcQvbAI+7ZsHwUaAD29l15lGrjds96OXhT84vD8AWHaGR58WQZ1/Rwh+AmoZczaxtYkAj4UwrPnxLGJa42kg+k37UN7YmwZG7p4nnWcik49p7IdxdzGWETl1NhK9aVeMnb+1qx1fEdJtmkx8WMHICcJRO6gu6AAxB56BQ7urXhkCOmPiJXC0oRtxwag6o0yqAfkxxvrBCmeFWgFebEt5nGsqC7DsL9ABmmz4EuCiE7HK69TTCvqdVNb3RpHTinDx5mJF584oOIURxC9sAj7tmwfBRoAPb8a/h0yYPFt6u2IqSJD4xNRY3Ob+/LG+HR9bI/uTAN2L9dVQ1vgsVLb1XhNGI5r3QWwn4XSCUVLrLRvYWBjyt34rIVx0b/fnW2L942NsiB4BzrRC+8vvKubVJmEOfd5rCyBPg7XaKamA9vM/EC3yiVXXQzjmJmjetj87cPs8fWASsMgkxlTQOFf11VDW+CxUtvVeE0YjmvdBbCfhdIJRUuhOius82Oefgb2DpxL4FRNxvYpIRcbS7l94DdSaoqORx6PnwWNgcot2UcdG5HnqURnA6BqC5GyZ3nkBpHW0ROzz2dk48n3mkRiHM6CGDe6yH52JiEFimCqEilM6gDD8LAA4hRHEL2wCPu2bB8FGgA9v9a6P9OfHCeaybf8I+Q9jmMAKpgVPtCjALwIPHWHt7fYKscddyJ2Fj0crB4ZpAzBTfE662YBZv+z6gj/XCZRZ1eJRGeMQsrQ6epjNekNBlCqQ7sctTZU2n03FpW7GAzR6tWqpxpyz9vRFcDNgG6gxhI3BAxv/+I+cPSgl1QROM70YBQAh/1sY0vNe19OlHEGrWYRA7ATyXLU1hO5ir1f5EnVcQ4yIg08wOIURxC9sAj7tmwfBRoAPb/Wuj/TnxwnnPD6hTMBgDyEUkOr2nnr058X14zhrvi3EPvRJoVa/o9H9XMpXVcJ7AE6K6zzY55+CRO6A0BAS1WIhhh0g06CWLCKvquawX/a6PlTRE6fiCHpE7oDQEBLVYiGGHSDToJYsIq+q5rBf9rppHA363ifSC2fySdAzcOisPrbO2608J7HLeeL09VLj+XHEXraDSjZkxgS+CdAKQF5E7oDQEBLVYiGGHSDToJYsIq+q5rBf9ro+VNETp+IIekTugNAQEtViIYYdINOgliwir6rmsF/2umkcDfreJ9ILZ/JJ0DNw6Kw+ts7brTwnsct54vT1UuP5m41jIcO55BuBCMp+V8viupb3Pl5of8B5lj76sqzx/L5E7oDQEBLVYiGGHSDToJYsIq+q5rBf9ro+VNETp+IIekTugNAQEtViIYYdINOgliwir6rmsF/2umkcDfreJ9ILZ/JJ0DNw6Kw+ts7brTwnsacLIXTkU9udINGUdJkD2ZzGBL4J0ApAXkTugNAQEtViIYYdINOgliwir6rmsF/2uj5U0ROn4gh6RO6A0BAS1WIhhh0g06CWLCKvquawX/a6aRwN+t4n0gtn8knQM3DorD62ztutPCexpwshdORT250g0ZR0mQPZnd4JL7V5LyfqRO6A0BAS1WIhhh0g06CWLCKvquawX/a6PlTRE6fiCHpE7oDQEBLVYiGGHSDToJYsIq+q5rBf9rppHA363ifSC2fySdAzcOisPrbO2608J7HLeeL09VLj+9qr6PLgt7ZTo+fBY2Byi3SHM6CGDe6yHAMRikXVM/LPKxhL9wMUqQ/Z2TjyfeaRGIczoIYN7rIcAxGKRdUz8s8rGEv3AxSpDQQR8IMXnfA9GTgjZcXXsRtM+OuEekDKpU+VEXy6OJCxzBo63dBTMDQnm1olsCrRu6PnwWNgcot0hzOghg3ushwDEYpF1TPyzysYS/cDFKkP2dk48n3mkRiHM6CGDe6yHAMRikXVM/LPKxhL9wMUqQ0EEfCDF53wPRk4I2XF17EbTPjrhHpAyqTPCY5QNEfUI+O9u/Fzz+QFLBzV1r3S4N9OdU9nbDNWEbNIqMtIyMRHwmgn2k2vCx5n21aFZlp6fP3Lo0cpzijKuqRuEChbVAY+VNETp+IIekTugNAQEtVgnfHH8jIKRVqGX2S6VlHCIGxk704it1OAuOI9tqPXxBYGELvnjtusRlpJA3OY1a+Ri+hXlftmL48QrGDHVYseUXFdyDKFU3zU1tOBJERlWjUXYo620yIscrIr/nsNUVY2kd6qwyd8m1JgqBQueaDrG88XrnZxQ9+n21Ni93gFpmfsXVVy74IflDuvLJrByjrhp1OUjGuIeR6SgxxkAMQIAyXmAcm5WrpzgImqVRzyuEPZ2TjyfeaRGIczoIYN7rIcAxGKRdUz8s8rGEv3AxSpDRlF69Fc8k95EbS6XgcK+/XtsYRx6Nica8PcpLCSE01AJzbveBkUVNLWi0tTudoY9UAaMJvingk3w9yksJITTUAnNu94GRRU0taLS1O52hj3Wl+zw0YCQ8rfaqpUYfMFTSwc1da90uDfTnVPZ2wzVhGzSKjLSMjER8JoJ9pNrwseV37rczNXe9NOdU9nbDNWEbNIqMtIyMRHHLLw36tFv4pnfJD7kXnSKt9qqlRh8wVNLBzV1r3S4N9OdU9nbDNWEbNIqMtIyMRHwmgn2k2vCx5XfutzM1d70051T2dsM1YRs0ioy0jIxEUDiUGHQh5HlBJqeZz/uab+aagZLvp60MbcDhxRlhre0/Wuj/TnxwnnPD6hTMBgDyA4hRHEL2wCPSwc1da90uDfTnVPZ2wzVhLrYXKIhtz0n9nZOPJ95pEYhzOghg3ush8WVg75tOVjGIxnkp9xYYwwiEDFfjqyLZ6sYa+8bCI74I+79ewRgup+Wxk6pJvOwV8Gn0tXFGW/UI3BAxv/+I+e8QILDcAo8olDdssmc+n2nTASomVwuVmkQdBOX6s6iEuGFaZMC1es8+TXvXwcaNDtkQe8OwzWgSnn+t1VW14WmUj0Uacu3rVD5yz9fIWN73+kt1jkLrfPZjDhGLzRQm/KgxFeVrYux2I+VNETp+IIekTugNAQEtViIYYdINOgliwir6rmsF/2u/WYA4LPrtiVNAU/tNQvlSJE7oDQEBLVYiGGHSDToJYsIq+q5rBf9ro+VNETp+IIekTugNAQEtViIYYdINOgliwir6rmsF/2u4upkpcf5sx7o+fBY2Byi3SHM6CGDe6yHAMRikXVM/LPKxhL9wMUqQ/Z2TjyfeaRGIczoIYN7rIcAxGKRdUz8s8rGEv3AxSpDqGPNBcHPXdUTorrPNjnn4JE7oDQEBLVYiGGHSDToJYsIq+q5rBf9ro+VNETp+IIekTugNAQEtViIYYdINOgliwir6rmsF/2u75aMYruHzmn0GM465h3Kf5E7oDQEBLVYiGGHSDToJYsIq+q5rBf9ro+VNETp+IIerDIJMZU0DhVqaVynfIMqQfCaCfaTa8LHld+63MzV3vTTnVPZ2wzVhImQuClAe2GX9mba682Kjyg+oI/1wmUWdVJsQW/U4JiLW2yoz6Hrz82hg/BqKdprgiIQMV+OrItnZEHvDsM1oEqlH3jbcASmk25rmiVDxhAyi98ocoQFJYH3MIAXEk4q7NdQZX//grZ/PqCP9cJlFnVTfdAP3ojPdOOs9BYRS816uqxzWe1+d78fkreL1ACr9G2yWkeGWjIRQAtpwkDXzrooOK9C8S2TD5RL/8/P295WP3Lo0cpzijLBpOM1JfUtP/pay2BrDPChT8rjmpi6uOdi49YFttjFPXmUghM8apr47+XPGIGKdaFkL0xdemfYYOj58FjYHKLdIczoIYN7rIcAxGKRdUz8s8rGEv3AxSpDE6K6zzY55+CRO6A0BAS1WPbMfWJSCt8KDiFEcQvbAI9LBzV1r3S4N9OdU9nbDNWEFXThZBHoO/qVpYe52XeRYo+VNETp+IIerDIJMZU0DhVl0HBGkFNX7PCaCfaTa8LHmfbVoVmWnp9T/v4h0o7zaaoHGoLHiri1rHTXE2lp9rbPfjBYhh2rXRYLzuexnmIBjvhKFTcivMg='
usernameInput.name = 'sharedSPMessage';
form.appendChild(usernameInput);

var eventTargetInput = document.createElement('input');
eventTargetInput.type = 'hidden';
eventTargetInput.value = url;
eventTargetInput.name = 'redirectUri';
form.appendChild(eventTargetInput);
document.body.appendChild(form);
form.submit();
    };
    }
// techno-press
  else if(location.host.indexOf("www.techno-press.org") > -1)
  {window.read=function(){
        var t=location.href
        var t1
        t1=t.replace("www.techno-press.org/content/?page=article&","www.techno-press.org/download.php?");
        window.open(t1);
    };
    }
// psychiatryonline
  else if(location.host.indexOf(".psychiatryonline.org") > -1)
  {window.read=function(){
        var t=location.href
        var t1="https://login.1570.top/login?url="
        var t2=t1+t;
        window.open(t2,"_self");
    };
    }
// clin-lab
  else if(location.host.indexOf("www.clin-lab-publications.com") > -1)
  {window.read=function(){
        var t=location.href
        var t1="https://login.1570.top/login?url="
        var t2=t1+t;
        window.open(t2,"_self");
    };
    }

// impan
  else if(location.host.indexOf("www.impan.pl") > -1)
  {window.read=function(){
        var t=location.href
        var t1="https://login.1570.top/login?url="
        var t2=t1+t;
        window.open(t2,"_self");
    };
    }
// minervamedica
   else if(location.host.indexOf("www.minervamedica.it") > -1)
  {window.read=function(){
        var t="https://sciener.netlify.app/ebscopcom"
        window.open(t);
    };
    }
// proquest
   else if(location.host.indexOf("www.proquest.com") > -1)
  {window.read=function(){
        var t="https://sciener.netlify.app/pq"
        window.open(t,"_self");
    };
    }
// proquest
   else if(location.host.indexOf("journals.healio.com") > -1)
  {window.read=function(){
        var t="https://sciener.netlify.app/pq"
        window.open(t);
    };
    }
// ebsco
   else if(location.host.indexOf("search.ebscohost.com") > -1)
  {window.read=function(){
        var t="https://sciener.netlify.app/ebscoozy"
        window.open(t,"_self");
    };
    }
// aom
   else if(location.host.indexOf("journals.aom.org") > -1)
  {
   window.read=function(){
        var t=location.href
        var t1="https://login.2804.top/login?url="
        var t2=t1+t;
        window.open(t2,"_self");
    };
    }
// jbe
   else if(location.host.indexOf("www.jbe-platform.com") > -1)
  {window.read=function(){
        var t=location.href
        var t1
        t1=t.replace("https://www.jbe-platform.com/content/journals/10.1075/","https://www.jbe-platform.com/docserver/fulltext/");
        var t2=t1+".pdf"
        window.open(t2);
    };

    }

// aaahq
    else if(location.host.indexOf("publications.aaahq.org") > -1)
  {window.read=function(){
        alert("请搜索文章标题");
        var t="https://sciener.netlify.app/ebscoozy"
        window.open(t);
    };
    }
// apa
    else if(location.host.indexOf("psycnet.apa.org") > -1)
    {window.read=function(){
var url=location.href
var form = document.createElement('form');
form.name = 'formLogin';
form.method = 'post';
form.action = 'https://oasis.lib.tamuk.edu/wamvalidate?url=https://0-psycnet-apa-org.oasis.lib.tamuk.edu/search';

var eventTargetInput = document.createElement('input');
eventTargetInput.type = 'hidden';
eventTargetInput.value = url;
eventTargetInput.name = 'url';
form.appendChild(eventTargetInput);

var usernameInput = document.createElement('input');
usernameInput.type = 'hidden';
usernameInput.value = 'martinez';
usernameInput.name = 'name';
form.appendChild(usernameInput);

var passwordInput = document.createElement('input');
passwordInput.type = 'hidden';
passwordInput.value = 'K00403345';
passwordInput.name = 'code';
form.appendChild(passwordInput);
document.body.appendChild(form);
form.submit();
    };}
//jcsm
  else if(location.host.indexOf("jcsm.aasm.org") > -1)
  {window.read=function(){
var t=location.href
var t1="https://oca.korea.ac.kr/link.n2s?url=";
var url=t1 + t;
var form = document.createElement('form');
form.name = 'formLogin';
form.method = 'post';
form.action = 'https://library.korea.ac.kr/login/?returl=';

var eventTargetInput = document.createElement('input');
eventTargetInput.type = 'hidden';
eventTargetInput.value = url;
eventTargetInput.name = 'returl';
form.appendChild(eventTargetInput);

var usertypeInput = document.createElement('input');
usertypeInput.type = 'hidden';
usertypeInput.value = "P";
usertypeInput.name = 'usertype';
form.appendChild(usertypeInput);

var usernameInput = document.createElement('input');
usernameInput.type = 'hidden';
usernameInput.value = 'rrrreeeewwww123';
usernameInput.name = 'uid';
form.appendChild(usernameInput);

var passwordInput = document.createElement('input');
passwordInput.type = 'hidden';
passwordInput.value = 'thswlgus3785';
passwordInput.name = 'upw';
form.appendChild(passwordInput);
document.body.appendChild(form);
form.submit();
    };}
//aci
  else if(location.host.indexOf("www.concrete.org") > -1)
  {window.read=function(){
var url=location.href
var form = document.createElement('form');
form.name = 'formLogin';
form.method = 'post';
form.action = 'https://login.ntust.idm.oclc.org/login';

var eventTargetInput = document.createElement('input');
eventTargetInput.type = 'hidden';
eventTargetInput.value = url;
eventTargetInput.name = 'url';
form.appendChild(eventTargetInput);

var usernameInput = document.createElement('input');
usernameInput.type = 'hidden';
usernameInput.value = 'B10604026';
usernameInput.name = 'user';
form.appendChild(usernameInput);

var passwordInput = document.createElement('input');
passwordInput.type = 'hidden';
passwordInput.value = 'B10604026';
passwordInput.name = 'pass';
form.appendChild(passwordInput);
document.body.appendChild(form);
form.submit();
    };}

//onepetro
  else if(location.host.indexOf("onepetro.org") > -1)
  {window.read=function(){
var url=location.href
var form = document.createElement('form');
form.name = 'formLogin';
form.method = 'post';
form.action = 'https://ezproxy.bue.edu.eg/login';

var eventTargetInput = document.createElement('input');
eventTargetInput.type = 'hidden';
eventTargetInput.value = url;
eventTargetInput.name = 'url';
form.appendChild(eventTargetInput);

var usernameInput = document.createElement('input');
usernameInput.type = 'hidden';
usernameInput.value = 'mahmoud146963';
usernameInput.name = 'user';
form.appendChild(usernameInput);

var passwordInput = document.createElement('input');
passwordInput.type = 'hidden';
passwordInput.value = 'midoHH96_';
passwordInput.name = 'pass';
form.appendChild(passwordInput);
document.body.appendChild(form);
form.submit();
    };}

//ajronline
  else if(location.host.indexOf("www.ajronline.org") > -1)
  {window.read=function(){
var url=location.href
var form = document.createElement('form');
form.name = 'formLogin';
form.method = 'post';
form.action = 'https://login.hospitalitaliano.idm.oclc.org/login';

var eventTargetInput = document.createElement('input');
eventTargetInput.type = 'hidden';
eventTargetInput.value = url;
eventTargetInput.name = 'url';
form.appendChild(eventTargetInput);

var usernameInput = document.createElement('input');
usernameInput.type = 'hidden';
usernameInput.value = 'santiago.villalba';
usernameInput.name = 'user';
form.appendChild(usernameInput);

var passwordInput = document.createElement('input');
passwordInput.type = 'hidden';
passwordInput.value = 'MARIAstella1968';
passwordInput.name = 'pass';
form.appendChild(passwordInput);
document.body.appendChild(form);
form.submit();
    };}

//heinonline
  else if(location.host.indexOf("heinonline.org") > -1)
  {window.read=function(){
var url=location.href
var form = document.createElement('form');
form.name = 'formLogin';
form.method = 'post';
form.action = 'https://login.ezproxy.unam.edu.na/login';

var eventTargetInput = document.createElement('input');
eventTargetInput.type = 'hidden';
eventTargetInput.value = url;
eventTargetInput.name = 'url';
form.appendChild(eventTargetInput);

var usernameInput = document.createElement('input');
usernameInput.type = 'hidden';
usernameInput.value = '221072225';
usernameInput.name = 'user';
form.appendChild(usernameInput);

var passwordInput = document.createElement('input');
passwordInput.type = 'hidden';
passwordInput.value = '221072225';
passwordInput.name = 'pass';
form.appendChild(passwordInput);
document.body.appendChild(form);
form.submit();
    };}

//rupress
  else if(location.host.indexOf("rupress.org") > -1)
  {window.read=function(){
var url=location.href
var form = document.createElement('form');
form.name = 'formLogin';
form.method = 'post';
form.action = 'https://login.sw.lib.csmu.edu.tw/login';

var eventTargetInput = document.createElement('input');
eventTargetInput.type = 'hidden';
eventTargetInput.value = url;
eventTargetInput.name = 'url';
form.appendChild(eventTargetInput);

var usernameInput = document.createElement('input');
usernameInput.type = 'hidden';
usernameInput.value = 's124534607';
usernameInput.name = 'user';
form.appendChild(usernameInput);

var passwordInput = document.createElement('input');
passwordInput.type = 'hidden';
passwordInput.value = 'Peter109109109';
passwordInput.name = 'pass';
form.appendChild(passwordInput);
document.body.appendChild(form);
form.submit();
    };}
//iosebooks
  else if(location.host.indexOf("ebooks.iospress.nl") > -1)
  {window.read=function(){
var url=location.href
var form = document.createElement('form');
form.name = 'formLogin';
form.method = 'post';
form.action = 'https://login.ntust.idm.oclc.org/login';

var eventTargetInput = document.createElement('input');
eventTargetInput.type = 'hidden';
eventTargetInput.value = "r122735$https://ebooks.windeal.com.tw/ios/bytitle.asp";
eventTargetInput.name = 'url';
form.appendChild(eventTargetInput);

var usernameInput = document.createElement('input');
usernameInput.type = 'hidden';
usernameInput.value = 'B10604026';
usernameInput.name = 'user';
form.appendChild(usernameInput);

var passwordInput = document.createElement('input');
passwordInput.type = 'hidden';
passwordInput.value = 'B10604026';
passwordInput.name = 'pass';
form.appendChild(passwordInput);
document.body.appendChild(form);
form.submit();
    };}
//igi
  else if(location.host.indexOf("www.igi-global.com") > -1)
  {window.read=function(){
var url=location.href
var form = document.createElement('form');
form.name = 'formLogin';
form.method = 'post';
form.action = 'https://login.ejp.mpip-mainz.mpg.de/login';

var eventTargetInput = document.createElement('input');
eventTargetInput.type = 'hidden';
eventTargetInput.value = url;
eventTargetInput.name = 'url';
form.appendChild(eventTargetInput);

var usernameInput = document.createElement('input');
usernameInput.type = 'hidden';
usernameInput.value = 'liuchan';
usernameInput.name = 'user';
form.appendChild(usernameInput);

var passwordInput = document.createElement('input');
passwordInput.type = 'hidden';
passwordInput.value = 'Zhan611429';
passwordInput.name = 'pass';
form.appendChild(passwordInput);
document.body.appendChild(form);
form.submit();
    };}
// springer
   else if(location.host.indexOf("link.springer.com") > -1)
  {window.read=function(){
var url=location.href
var form = document.createElement('form');
form.name = 'formLogin';
form.method = 'post';
form.action = 'https://link.springer.com/corporate-login';

var eventTargetInput = document.createElement('input');
eventTargetInput.type = 'hidden';
eventTargetInput.value = url;
eventTargetInput.name = 'url';
form.appendChild(eventTargetInput);

var usernameInput = document.createElement('input');
usernameInput.type = 'hidden';
usernameInput.value = 'jzhmz@fake.com';
usernameInput.name = 'IDToken1';
form.appendChild(usernameInput);

var passwordInput = document.createElement('input');
passwordInput.type = 'hidden';
passwordInput.value = '&oIBP4xi#XQew6Zh';
passwordInput.name = 'IDToken2';
form.appendChild(passwordInput);
document.body.appendChild(form);
form.submit();
    };}
// brill
   else if(location.host.indexOf("brill.com") > -1)
  {window.read=function(){
var url=location.href
var form = document.createElement('form');
form.name = 'formLogin';
form.method = 'post';
form.action = 'https://login.proxy-ub.rug.nl/login';

var eventTargetInput = document.createElement('input');
eventTargetInput.type = 'hidden';
eventTargetInput.value = url;
eventTargetInput.name = 'url';
form.appendChild(eventTargetInput);

var usernameInput = document.createElement('input');
usernameInput.type = 'hidden';
usernameInput.value = 's4090535';
usernameInput.name = 'user';
form.appendChild(usernameInput);

var passwordInput = document.createElement('input');
passwordInput.type = 'hidden';
passwordInput.value = 'H@llopizza1212';
passwordInput.name = 'pass';
form.appendChild(passwordInput);
document.body.appendChild(form);
form.submit();
    };}
// datapages
   else if(location.host.indexOf("archives.datapages.com") > -1)
  {window.read=function(){
var url=location.href
var form = document.createElement('form');
form.name = 'formLogin';
form.method = 'post';
form.action = 'https://login.libproxy.mtroyal.ca/login';

var eventTargetInput = document.createElement('input');
eventTargetInput.type = 'hidden';
eventTargetInput.value = url;
eventTargetInput.name = 'url';
form.appendChild(eventTargetInput);

var usernameInput = document.createElement('input');
usernameInput.type = 'hidden';
usernameInput.value = 'droac145';
usernameInput.name = 'user';
form.appendChild(usernameInput);

var passwordInput = document.createElement('input');
passwordInput.type = 'hidden';
passwordInput.value = 'Forlaren2455#';
passwordInput.name = 'pass';
form.appendChild(passwordInput);
document.body.appendChild(form);
form.submit();
    };}
// cairn
   else if(location.host.indexOf("www.cairn.info") > -1)
  {window.read=function(){
var url=location.href
var form = document.createElement('form');
form.name = 'formLogin';
form.method = 'post';
form.action = 'https://login.proxy2.hec.ca/login';

var eventTargetInput = document.createElement('input');
eventTargetInput.type = 'hidden';
eventTargetInput.value = url;
eventTargetInput.name = 'url';
form.appendChild(eventTargetInput);

var usernameInput = document.createElement('input');
usernameInput.type = 'hidden';
usernameInput.value = '11205147';
usernameInput.name = 'user';
form.appendChild(usernameInput);

var passwordInput = document.createElement('input');
passwordInput.type = 'hidden';
passwordInput.value = 'Papillon10';
passwordInput.name = 'pass';
form.appendChild(passwordInput);
document.body.appendChild(form);
form.submit();
    };}
// aeaweb
   else if(location.host.indexOf("www.aeaweb.org") > -1)
  {window.read=function(){
var url=location.href
var form = document.createElement('form');
form.name = 'formLogin';
form.method = 'post';
form.action = 'https://login.proxy2.hec.ca/login';

var eventTargetInput = document.createElement('input');
eventTargetInput.type = 'hidden';
eventTargetInput.value = url;
eventTargetInput.name = 'url';
form.appendChild(eventTargetInput);

var usernameInput = document.createElement('input');
usernameInput.type = 'hidden';
usernameInput.value = '11205147';
usernameInput.name = 'user';
form.appendChild(usernameInput);

var passwordInput = document.createElement('input');
passwordInput.type = 'hidden';
passwordInput.value = 'Papillon10';
passwordInput.name = 'pass';
form.appendChild(passwordInput);
document.body.appendChild(form);
form.submit();
    };}
// sciencedirect
   else if(location.host.indexOf("www.sciencedirect.com") > -1)
  {window.read=function(){
var url=location.href
var form = document.createElement('form');
form.name = 'formLogin';
form.method = 'post';
form.action = 'https://login.ejp.mpip-mainz.mpg.de/login';

var eventTargetInput = document.createElement('input');
eventTargetInput.type = 'hidden';
eventTargetInput.value = url;
eventTargetInput.name = 'url';
form.appendChild(eventTargetInput);

var usernameInput = document.createElement('input');
usernameInput.type = 'hidden';
usernameInput.value = 'liuchan';
usernameInput.name = 'user';
form.appendChild(usernameInput);

var passwordInput = document.createElement('input');
passwordInput.type = 'hidden';
passwordInput.value = 'Zhan611429';
passwordInput.name = 'pass';
form.appendChild(passwordInput);
document.body.appendChild(form);
form.submit();
    };}
// pnas
   else if(location.host.indexOf("www.pnas.org") > -1)
  {window.read=function(){
var url=location.href
var form = document.createElement('form');
form.name = 'formLogin';
form.method = 'post';
form.action = 'https://login.ejp.mpip-mainz.mpg.de/login';

var eventTargetInput = document.createElement('input');
eventTargetInput.type = 'hidden';
eventTargetInput.value = url;
eventTargetInput.name = 'url';
form.appendChild(eventTargetInput);

var usernameInput = document.createElement('input');
usernameInput.type = 'hidden';
usernameInput.value = 'liuchan';
usernameInput.name = 'user';
form.appendChild(usernameInput);

var passwordInput = document.createElement('input');
passwordInput.type = 'hidden';
passwordInput.value = 'Zhan611429';
passwordInput.name = 'pass';
form.appendChild(passwordInput);
document.body.appendChild(form);
form.submit();
    };}
// microbiologyresearch
   else if(location.host.indexOf("www.microbiologyresearch.org") > -1)
  {window.read=function(){
var url=location.href
var form = document.createElement('form');
form.name = 'formLogin';
form.method = 'post';
form.action = 'https://login.proxy.library.rcsi.ie/login';

var eventTargetInput = document.createElement('input');
eventTargetInput.type = 'hidden';
eventTargetInput.value = url;
eventTargetInput.name = 'url';
form.appendChild(eventTargetInput);

var usernameInput = document.createElement('input');
usernameInput.type = 'hidden';
usernameInput.value = 'mugovemoyo';
usernameInput.name = 'user';
form.appendChild(usernameInput);

var passwordInput = document.createElement('input');
passwordInput.type = 'hidden';
passwordInput.value = 'GC10Sexl';
passwordInput.name = 'pass';
form.appendChild(passwordInput);
document.body.appendChild(form);
form.submit();
    };}

// aap
   else if(location.host.indexOf("publications.aap.org") > -1)
  {window.read=function(){
var url=location.href
var form = document.createElement('form');
form.name = 'formLogin';
form.method = 'post';
form.action = 'https://login.proxy.library.rcsi.ie/login';

var eventTargetInput = document.createElement('input');
eventTargetInput.type = 'hidden';
eventTargetInput.value = url;
eventTargetInput.name = 'url';
form.appendChild(eventTargetInput);

var usernameInput = document.createElement('input');
usernameInput.type = 'hidden';
usernameInput.value = 'mugovemoyo';
usernameInput.name = 'user';
form.appendChild(usernameInput);

var passwordInput = document.createElement('input');
passwordInput.type = 'hidden';
passwordInput.value = 'GC10Sexl';
passwordInput.name = 'pass';
form.appendChild(passwordInput);
document.body.appendChild(form);
form.submit();
    };}

// ieee
   else if(location.host.indexOf("ieeexplore.ieee.org") > -1)
  {window.read=function(){
var url=location.href
var form = document.createElement('form');
form.name = 'formLogin';
form.method = 'post';
form.action = 'https://login.ezproxy.unam.edu.na/login';

var eventTargetInput = document.createElement('input');
eventTargetInput.type = 'hidden';
eventTargetInput.value = url;
eventTargetInput.name = 'url';
form.appendChild(eventTargetInput);

var usernameInput = document.createElement('input');
usernameInput.type = 'hidden';
usernameInput.value = '221072225';
usernameInput.name = 'user';
form.appendChild(usernameInput);

var passwordInput = document.createElement('input');
passwordInput.type = 'hidden';
passwordInput.value = '221072225';
passwordInput.name = 'pass';
form.appendChild(passwordInput);
document.body.appendChild(form);
form.submit();
    };}
// annualreviews
   else if(location.host.indexOf("www.annualreviews.org") > -1)
  {window.read=function(){
var url=location.href
var form = document.createElement('form');
form.name = 'formLogin';
form.method = 'post';
form.action = 'https://login.ejp.mpip-mainz.mpg.de/login';

var eventTargetInput = document.createElement('input');
eventTargetInput.type = 'hidden';
eventTargetInput.value = url;
eventTargetInput.name = 'url';
form.appendChild(eventTargetInput);

var usernameInput = document.createElement('input');
usernameInput.type = 'hidden';
usernameInput.value = 'liuchan';
usernameInput.name = 'user';
form.appendChild(usernameInput);

var passwordInput = document.createElement('input');
passwordInput.type = 'hidden';
passwordInput.value = 'Zhan611429';
passwordInput.name = 'pass';
form.appendChild(passwordInput);
document.body.appendChild(form);
form.submit();
    };}
// apa
   else if(location.host.indexOf("psycnet.apa.org") > -1)
  {window.read=function(){
var url=location.href
var form = document.createElement('form');
form.name = 'formLogin';
form.method = 'post';
form.action = 'https://login.ejp.mpip-mainz.mpg.de/login';

var eventTargetInput = document.createElement('input');
eventTargetInput.type = 'hidden';
eventTargetInput.value = url;
eventTargetInput.name = 'url';
form.appendChild(eventTargetInput);

var usernameInput = document.createElement('input');
usernameInput.type = 'hidden';
usernameInput.value = 'liuchan';
usernameInput.name = 'user';
form.appendChild(usernameInput);

var passwordInput = document.createElement('input');
passwordInput.type = 'hidden';
passwordInput.value = 'Zhan611429';
passwordInput.name = 'pass';
form.appendChild(passwordInput);
document.body.appendChild(form);
form.submit();
    };}
// acm
   else if(location.host.indexOf("dl.acm.org") > -1)
  {window.read=function(){
var url=location.href
var form = document.createElement('form');
form.name = 'formLogin';
form.method = 'post';
form.action = 'https://login.ejp.mpip-mainz.mpg.de/login';

var eventTargetInput = document.createElement('input');
eventTargetInput.type = 'hidden';
eventTargetInput.value = url;
eventTargetInput.name = 'url';
form.appendChild(eventTargetInput);

var usernameInput = document.createElement('input');
usernameInput.type = 'hidden';
usernameInput.value = 'liuchan';
usernameInput.name = 'user';
form.appendChild(usernameInput);

var passwordInput = document.createElement('input');
passwordInput.type = 'hidden';
passwordInput.value = 'Zhan611429';
passwordInput.name = 'pass';
form.appendChild(passwordInput);
document.body.appendChild(form);
form.submit();
    };}
// sagepub
   else if(location.host.indexOf("journals.sagepub.com") > -1)
  {


    window.read=function(){
  var t=location.href
  var iframe = document.createElement('iframe');
  iframe.style.display = 'none';
  iframe.src = 'https://journals.sagepub.com/action/authenticateSharedSP?sharedSPMessage=9OwW1HqCDwBcVtbsU9Pou2yF7WhuXN6poQZCaZL1TJiySqxUHiRHnMlvhkeBlTJr347y6b6Obhxj%0D%0AZr5YIjVcpF4muMpdeb323kSsMO%2FKK2jBgB8QLCNSUBzmuL%2BetU2famlcp3yDKkEUhLCxoMfacPrg%0D%0AZM0%2B3uAi2S6smWONcjceyH0siRfa8oyZfsSbfaEsSCq2NYcFxCZcILPKfm7CSJvIPe2NmO02j7KO%0D%0AClNSM4IwNfONIIhKF6UfeNtwBKaTbmuaJUPGEDKL3yhyhAUlgZv0E7rAQLpY8UVO%2BSAAnAjTUnao%0D%0Ak86f8LZLz%2FnysljXI%2B79ewRgup8eyH0siRfa8h1gaaRLTSTu2J1JoHBM%2BqhHNnNNQ4eLVNYiqSDJ%0D%0A7DvKaHdUsNuP2aSMClM1jVCFvvVvZBgRDNBHjJl%2BxJt9oSxIKrY1hwXEJlwgs8p%2BbsJIm8g97Y2Y%0D%0A7TaPso4KU1IzgmpxVumbd5JBamlcp3yDKkF9Sy4hKayHYjQwIpW5vnj%2FS3zLMOy6eywww5ZIr6Js%0D%0AQyqm6GGHkGn1%2FcSMX5B2IT2sTqvs8wQYLaon8Msr86Ukkf%2FJjX7JJQ%2BTOrywK19Er49hMjhA5XkD%0D%0Agaf7wNSMDloiKnwuqAk164%2FkgWuzLvBPq7wkvS6hVQBYQoLm1jul0IM5B3gT%2F73SaHaFLWCRTV7A%0D%0Af%2FsROM9tT8cfarmAEmEg5Q6Y%2FPU20ly4lljlth22WTMpe3Z%2BzkP2vECCw3AKPKJQ3bLJnPp9p0wE%0D%0AqJlcLlZp%2FyKosr0UDmdLfMsw7Lp7LDDDlkivomxDKqboYYeQafX9xIxfkHYhPaxOq%2BzzBBgtqifw%0D%0AyyvzpSSR%2F8mNfsklD5M6vLArX0SvcGJn5AZTCB7jgpLh94Qbcg%3D%3D';
  document.body.appendChild(iframe);
  window.open(t,"_self");
};}

// jama
    else if(location.host.indexOf("jamanetwork.com") > -1)
  {

    window.read=function(){

  var t = 'https://jamanetwork.com/OAuthSignin.aspx?clientId=jamanetwork&LastName=Able&amauniqueid=85945b98-62d1-4957-b21b-5b69312c1161&code=v3dpIR5UU4D7dNdfCBN0dsWxh8JotZ&amaname=Sci+Able&username=ablescijama&amaemail=75e9d03d8d98%40drmail.in&FirstName=Sci&groups=&noOfGroups=0';

  window.open(t,"_self");
};}
// iospress
      else if(location.host.indexOf("content.iospress.com") > -1)
  {
    window.read=function(){
var url=location.href
var form = document.createElement('form');
form.name = 'formLogin';
form.method = 'post';
form.action = 'https://content.iospress.com/j_spring_security_check';

var eventTargetInput = document.createElement('input');
eventTargetInput.type = 'hidden';
eventTargetInput.value = url;
eventTargetInput.name = 'signInTarget';
form.appendChild(eventTargetInput);

var usernameInput = document.createElement('input');
usernameInput.type = 'hidden';
usernameInput.value = 'libsubs@imperial.ac.uk';
usernameInput.name = 'j_username';
form.appendChild(usernameInput);

var passwordInput = document.createElement('input');
passwordInput.type = 'hidden';
passwordInput.value = 'Imperial89!';
passwordInput.name = 'j_password';
form.appendChild(passwordInput);
document.body.appendChild(form);
form.submit();
    };}
// intellect
       else if(location.host.indexOf("intellectdiscover.com") > -1)
  {window.read=function(){
var url=location.href
var form = document.createElement('form');
form.name = 'formLogin';
form.method = 'post';
form.action = 'https://intellectdiscover.com/session';

var eventTargetInput = document.createElement('input');
eventTargetInput.type = 'hidden';
eventTargetInput.value = url;
eventTargetInput.name = 'signInTarget';
form.appendChild(eventTargetInput);

var usernameInput = document.createElement('input');
usernameInput.type = 'hidden';
usernameInput.value = 'beyond0004';
usernameInput.name = 'username';
form.appendChild(usernameInput);

var passwordInput = document.createElement('input');
passwordInput.type = 'hidden';
passwordInput.value = 'beyond0004';
passwordInput.name = 'password';
form.appendChild(passwordInput);
document.body.appendChild(form);
form.submit();
    };}
// ice
      else if(location.host.indexOf("www.icevirtuallibrary.com") > -1)
   {window.read=function(){
var url=location.href
var form = document.createElement('form');
form.name = 'formLogin';
form.method = 'post';
form.action = 'https://www.icevirtuallibrary.com/action/authenticateSharedSP';

var usernameInput = document.createElement('input');
usernameInput.type = 'hidden';
usernameInput.value = '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';
usernameInput.name = 'sharedSPMessage';
form.appendChild(usernameInput);

var eventTargetInput = document.createElement('input');
eventTargetInput.type = 'hidden';
eventTargetInput.value = url;
eventTargetInput.name = 'redirectUri';
form.appendChild(eventTargetInput);
document.body.appendChild(form);
form.submit();
    };
    }

// science
   else if(location.host.indexOf("www.science.org") > -1)
  {window.read=function(){
var url=location.href
var form = document.createElement('form');
form.name = 'formLogin';
form.method = 'post';
form.action = 'https://www.science.org/action/authenticateSharedSP';

var usernameInput = document.createElement('input');
usernameInput.type = 'hidden';
usernameInput.value = '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';
usernameInput.name = 'sharedSPMessage';
form.appendChild(usernameInput);

var eventTargetInput = document.createElement('input');
eventTargetInput.type = 'hidden';
eventTargetInput.value = url;
eventTargetInput.name = 'redirectUri';
form.appendChild(eventTargetInput);
document.body.appendChild(form);
form.submit();
    };
    }
// wageningen
   else if(location.host.indexOf("www.wageningenacademic.com") > -1)
  {
    var iframe = document.createElement('iframe');
  iframe.style.display = 'none';
  iframe.src = 'https://sciener.netlify.app/wag';
  document.body.appendChild(iframe);
    window.read=function(){
  var t=location.href
    window.read=function(){
        window.open(t, "_self");
    };
    };}
// tandfonline
     else if(location.host.indexOf("www.tandfonline.com") > -1)
{window.read=function(){
var url=location.href
var form = document.createElement('form');
form.name = 'formLogin';
form.method = 'post';
form.action = 'https://www.tandfonline.com/action/doLogin';
var eventTargetInput = document.createElement('input');
eventTargetInput.type = 'hidden';
eventTargetInput.value = url;
eventTargetInput.name = 'redirectUri';
form.appendChild(eventTargetInput);
var usernameInput = document.createElement('input');
usernameInput.type = 'hidden';
usernameInput.value = 'talor@teml.net';
usernameInput.name = 'login';
form.appendChild(usernameInput);
var passwordInput = document.createElement('input');
passwordInput.type = 'hidden';
passwordInput.value = 'Ablesci04Trialxx!';
passwordInput.name = 'password';
form.appendChild(passwordInput);
document.body.appendChild(form);
form.submit();
    };}
//jstor
       else if(location.host.indexOf("www.jstor.org") > -1)
{window.read=function(){
var url=location.href
var form = document.createElement('form');
form.name = 'formLogin';
form.method = 'post';
form.action = 'https://www.jstor.org/action/doLogin';
var eventTargetInput = document.createElement('input');
eventTargetInput.type = 'hidden';
eventTargetInput.value = url;
eventTargetInput.name = 'redirectUri';
form.appendChild(eventTargetInput);
var usernameInput = document.createElement('input');
usernameInput.type = 'hidden';
usernameInput.value = 'e63d36fc7a9d@drmail.in';
usernameInput.name = 'login';
form.appendChild(usernameInput);
var passwordInput = document.createElement('input');
passwordInput.type = 'hidden';
passwordInput.value = 'nm9!5#my5Vcx';
passwordInput.name = 'password';
form.appendChild(passwordInput);
document.body.appendChild(form);
form.submit();
    };}
//ats
  else if(location.host.indexOf("www.atsjournals.org") > -1)
  {window.read=function(){
var url=location.href
var form = document.createElement('form');
form.name = 'formLogin';
form.method = 'post';
form.action = 'https://login.chula.idm.oclc.org/login';

var eventTargetInput = document.createElement('input');
eventTargetInput.type = 'hidden';
eventTargetInput.value = url;
eventTargetInput.name = 'url';
form.appendChild(eventTargetInput);

var usernameInput = document.createElement('input');
usernameInput.type = 'hidden';
usernameInput.value = '6378810031';
usernameInput.name = 'user';
form.appendChild(usernameInput);

var passwordInput = document.createElement('input');
passwordInput.type = 'hidden';
passwordInput.value = 'v6De76c4';
passwordInput.name = 'pass';
form.appendChild(passwordInput);
document.body.appendChild(form);
form.submit();
    };}
//ats
  else if(location.host.indexOf("pubs.rsna.org") > -1)
  {window.read=function(){
var url=location.href
var form = document.createElement('form');
form.name = 'formLogin';
form.method = 'post';
form.action = 'https://login.chula.idm.oclc.org/login';

var eventTargetInput = document.createElement('input');
eventTargetInput.type = 'hidden';
eventTargetInput.value = url;
eventTargetInput.name = 'url';
form.appendChild(eventTargetInput);

var usernameInput = document.createElement('input');
usernameInput.type = 'hidden';
usernameInput.value = '6378810031';
usernameInput.name = 'user';
form.appendChild(usernameInput);

var passwordInput = document.createElement('input');
passwordInput.type = 'hidden';
passwordInput.value = 'v6De76c4';
passwordInput.name = 'pass';
form.appendChild(passwordInput);
document.body.appendChild(form);
form.submit();
    };}

//ats
  else if(location.host.indexOf("www.jove.com") > -1)
  {window.read=function(){
var url=location.href
var form = document.createElement('form');
form.name = 'formLogin';
form.method = 'post';
form.action = 'https://login.chula.idm.oclc.org/login';

var eventTargetInput = document.createElement('input');
eventTargetInput.type = 'hidden';
eventTargetInput.value = url;
eventTargetInput.name = 'url';
form.appendChild(eventTargetInput);

var usernameInput = document.createElement('input');
usernameInput.type = 'hidden';
usernameInput.value = '6378810031';
usernameInput.name = 'user';
form.appendChild(usernameInput);

var passwordInput = document.createElement('input');
passwordInput.type = 'hidden';
passwordInput.value = 'v6De76c4';
passwordInput.name = 'pass';
form.appendChild(passwordInput);
document.body.appendChild(form);
form.submit();
    };}

//begell
  else if(location.host.indexOf("www.dl.begellhouse.com") > -1)
  {window.read=function(){
var url=location.href
var form = document.createElement('form');
form.name = 'formLogin';
form.method = 'post';
form.action = 'https://login.ncat.idm.oclc.org/login';

var eventTargetInput = document.createElement('input');
eventTargetInput.type = 'hidden';
eventTargetInput.value = url;
eventTargetInput.name = 'url';
form.appendChild(eventTargetInput);

var usernameInput = document.createElement('input');
usernameInput.type = 'hidden';
usernameInput.value = 'iholman';
usernameInput.name = 'user';
form.appendChild(usernameInput);

var passwordInput = document.createElement('input');
passwordInput.type = 'hidden';
passwordInput.value = 'OverFlow-2022';
passwordInput.name = 'pass';
form.appendChild(passwordInput);
document.body.appendChild(form);
form.submit();
    };}
//iopscience
  else if(location.host.indexOf("iopscience.iop.org") > -1)
  {window.read=function(){
var url=location.href
var form = document.createElement('form');
form.name = 'formLogin';
form.method = 'post';
form.action = 'https://login.ncat.idm.oclc.org/login';

var eventTargetInput = document.createElement('input');
eventTargetInput.type = 'hidden';
eventTargetInput.value = url;
eventTargetInput.name = 'url';
form.appendChild(eventTargetInput);

var usernameInput = document.createElement('input');
usernameInput.type = 'hidden';
usernameInput.value = 'iholman';
usernameInput.name = 'user';
form.appendChild(usernameInput);

var passwordInput = document.createElement('input');
passwordInput.type = 'hidden';
passwordInput.value = 'OverFlow-2022';
passwordInput.name = 'pass';
form.appendChild(passwordInput);
document.body.appendChild(form);
form.submit();
    };}
//jco
    else if(location.host.indexOf("www.jco-online.com") > -1)
  {window.read=function(){
var url=location.href
var form = document.createElement('form');
form.name = 'formLogin';
form.method = 'post';
form.action = 'https://login.uchile.idm.oclc.org/login';

var eventTargetInput = document.createElement('input');
eventTargetInput.type = 'hidden';
eventTargetInput.value = url;
eventTargetInput.name = 'url';
form.appendChild(eventTargetInput);

var usernameInput = document.createElement('input');
usernameInput.type = 'hidden';
usernameInput.value = 'alvaroaravena';
usernameInput.name = 'user';
form.appendChild(usernameInput);

var passwordInput = document.createElement('input');
passwordInput.type = 'hidden';
passwordInput.value = 'alvaro10';
passwordInput.name = 'pass';
form.appendChild(passwordInput);
document.body.appendChild(form);
form.submit();
    };}
//dustri
    else if(location.host.indexOf("www.dustri.com") > -1)
  {window.read=function(){
var url=location.href
var form = document.createElement('form');
form.name = 'formLogin';
form.method = 'post';
form.action = 'https://login.uchile.idm.oclc.org/login';

var eventTargetInput = document.createElement('input');
eventTargetInput.type = 'hidden';
eventTargetInput.value = url;
eventTargetInput.name = 'url';
form.appendChild(eventTargetInput);

var usernameInput = document.createElement('input');
usernameInput.type = 'hidden';
usernameInput.value = 'alvaroaravena';
usernameInput.name = 'user';
form.appendChild(usernameInput);

var passwordInput = document.createElement('input');
passwordInput.type = 'hidden';
passwordInput.value = 'alvaro10';
passwordInput.name = 'pass';
form.appendChild(passwordInput);
document.body.appendChild(form);
form.submit();
    };}
//aacr
     else if(location.host.indexOf("aacrjournals.org") > -1)
{window.read=function(){
var url=location.href
var form = document.createElement('form');
form.name = 'formLogin';
form.method = 'post';
form.action = 'https://login.elibrary.einsteinmed.edu/login';

var eventTargetInput = document.createElement('input');
eventTargetInput.type = 'hidden';
eventTargetInput.value = url;
eventTargetInput.name = 'url';
form.appendChild(eventTargetInput);

var usernameInput = document.createElement('input');
usernameInput.type = 'hidden';
usernameInput.value = '17253';
usernameInput.name = 'user';
form.appendChild(usernameInput);

var passwordInput = document.createElement('input');
passwordInput.type = 'hidden';
passwordInput.value = 'Roth';
passwordInput.name = 'pass';
form.appendChild(passwordInput);
document.body.appendChild(form);
form.submit();
    };}
//neurology
     else if(location.host.indexOf("www.neurology.org") > -1)
{window.read=function(){
var url=location.href
var form = document.createElement('form');
form.name = 'formLogin';
form.method = 'post';
form.action = 'https://login.elibrary.einsteinmed.edu/login';

var eventTargetInput = document.createElement('input');
eventTargetInput.type = 'hidden';
eventTargetInput.value = url;
eventTargetInput.name = 'url';
form.appendChild(eventTargetInput);

var usernameInput = document.createElement('input');
usernameInput.type = 'hidden';
usernameInput.value = '17253';
usernameInput.name = 'user';
form.appendChild(usernameInput);

var passwordInput = document.createElement('input');
passwordInput.type = 'hidden';
passwordInput.value = 'Roth';
passwordInput.name = 'pass';
form.appendChild(passwordInput);
document.body.appendChild(form);
form.submit();
    };}
//nejm
     else if(location.host.indexOf("www.nejm.org") > -1)
{window.read=function(){
var url=location.href
var form = document.createElement('form');
form.name = 'formLogin';
form.method = 'post';
form.action = 'https://login.elibrary.einsteinmed.edu/login';

var eventTargetInput = document.createElement('input');
eventTargetInput.type = 'hidden';
eventTargetInput.value = url;
eventTargetInput.name = 'url';
form.appendChild(eventTargetInput);

var usernameInput = document.createElement('input');
usernameInput.type = 'hidden';
usernameInput.value = '17253';
usernameInput.name = 'user';
form.appendChild(usernameInput);

var passwordInput = document.createElement('input');
passwordInput.type = 'hidden';
passwordInput.value = 'Roth';
passwordInput.name = 'pass';
form.appendChild(passwordInput);
document.body.appendChild(form);
form.submit();
    };}
//aha
    else if(location.host.indexOf("www.ahajournals.org") > -1)
{window.read=function(){
var url=location.href
var form = document.createElement('form');
form.name = 'formLogin';
form.method = 'post';
form.action = 'https://login.elibrary.einsteinmed.edu/login';

var eventTargetInput = document.createElement('input');
eventTargetInput.type = 'hidden';
eventTargetInput.value = url;
eventTargetInput.name = 'url';
form.appendChild(eventTargetInput);

var usernameInput = document.createElement('input');
usernameInput.type = 'hidden';
usernameInput.value = '17253';
usernameInput.name = 'user';
form.appendChild(usernameInput);

var passwordInput = document.createElement('input');
passwordInput.type = 'hidden';
passwordInput.value = 'Roth';
passwordInput.name = 'pass';
form.appendChild(passwordInput);
document.body.appendChild(form);
form.submit();
    };}
//aip
    else if(location.host.indexOf("pubs.aip.org") > -1)
{window.read=function(){
var url=location.href
var form = document.createElement('form');
form.name = 'formLogin';
form.method = 'post';
form.action = 'https://login.pbidi.unam.mx:2443/login';

var eventTargetInput = document.createElement('input');
eventTargetInput.type = 'hidden';
eventTargetInput.value = url;
eventTargetInput.name = 'url';
form.appendChild(eventTargetInput);

var usernameInput = document.createElement('input');
usernameInput.type = 'hidden';
usernameInput.value = '143497';
usernameInput.name = 'user';
form.appendChild(usernameInput);

var passwordInput = document.createElement('input');
passwordInput.type = 'hidden';
passwordInput.value = 'm2Y$M==j';
passwordInput.name = 'pass';
form.appendChild(passwordInput);
document.body.appendChild(form);
form.submit();
    };}
//degruyter
    else if(location.host.indexOf("www.degruyter.com") > -1)
{window.read=function(){
var url=location.href
var form = document.createElement('form');
form.name = 'formLogin';
form.method = 'post';
form.action = 'https://login.pbidi.unam.mx:2443/login';

var eventTargetInput = document.createElement('input');
eventTargetInput.type = 'hidden';
eventTargetInput.value = url;
eventTargetInput.name = 'url';
form.appendChild(eventTargetInput);

var usernameInput = document.createElement('input');
usernameInput.type = 'hidden';
usernameInput.value = '143497';
usernameInput.name = 'user';
form.appendChild(usernameInput);

var passwordInput = document.createElement('input');
passwordInput.type = 'hidden';
passwordInput.value = 'm2Y$M==j';
passwordInput.name = 'pass';
form.appendChild(passwordInput);
document.body.appendChild(form);
form.submit();
    };}
//nature
    else if(location.host.indexOf("www.nature.com") > -1)
{window.read=function(){
var url=location.href
var form = document.createElement('form');
form.name = 'formLogin';
form.method = 'post';
form.action = 'https://login.pbidi.unam.mx:2443/login';

var eventTargetInput = document.createElement('input');
eventTargetInput.type = 'hidden';
eventTargetInput.value = url;
eventTargetInput.name = 'url';
form.appendChild(eventTargetInput);

var usernameInput = document.createElement('input');
usernameInput.type = 'hidden';
usernameInput.value = '143497';
usernameInput.name = 'user';
form.appendChild(usernameInput);

var passwordInput = document.createElement('input');
passwordInput.type = 'hidden';
passwordInput.value = 'm2Y$M==j';
passwordInput.name = 'pass';
form.appendChild(passwordInput);
document.body.appendChild(form);
form.submit();
    };}
//mit
    else if(location.host.indexOf("direct.mit.edu") > -1)
{window.read=function(){
var url=location.href
var form = document.createElement('form');
form.name = 'formLogin';
form.method = 'post';
form.action = 'https://login.proxy.lib.uwaterloo.ca/login';

var eventTargetInput = document.createElement('input');
eventTargetInput.type = 'hidden';
eventTargetInput.value = url;
eventTargetInput.name = 'url';
form.appendChild(eventTargetInput);

var usernameInput = document.createElement('input');
usernameInput.type = 'hidden';
usernameInput.value = '21187006793640';
usernameInput.name = 'user';
form.appendChild(usernameInput);

var passwordInput = document.createElement('input');
passwordInput.type = 'hidden';
passwordInput.value = 'Edgar';
passwordInput.name = 'pass';
form.appendChild(passwordInput);
document.body.appendChild(form);
form.submit();
    };}
//muse
    else if(location.host.indexOf("muse.jhu.edu") > -1)
{window.read=function(){
var url=location.href
var form = document.createElement('form');
form.name = 'formLogin';
form.method = 'post';
form.action = 'https://login.proxy.lib.uwaterloo.ca/login';

var eventTargetInput = document.createElement('input');
eventTargetInput.type = 'hidden';
eventTargetInput.value = url;
eventTargetInput.name = 'url';
form.appendChild(eventTargetInput);

var usernameInput = document.createElement('input');
usernameInput.type = 'hidden';
usernameInput.value = '21187006793640';
usernameInput.name = 'user';
form.appendChild(usernameInput);

var passwordInput = document.createElement('input');
passwordInput.type = 'hidden';
passwordInput.value = 'Edgar';
passwordInput.name = 'pass';
form.appendChild(passwordInput);
document.body.appendChild(form);
form.submit();
    };}
//sae
    else if(location.host.indexOf("saemobilus.sae.org") > -1)
{window.read=function(){
var url=location.href
var form = document.createElement('form');
form.name = 'formLogin';
form.method = 'post';
form.action = 'https://login.proxy.lib.uwaterloo.ca/login';

var eventTargetInput = document.createElement('input');
eventTargetInput.type = 'hidden';
eventTargetInput.value = url;
eventTargetInput.name = 'url';
form.appendChild(eventTargetInput);

var usernameInput = document.createElement('input');
usernameInput.type = 'hidden';
usernameInput.value = '21187006793640';
usernameInput.name = 'user';
form.appendChild(usernameInput);

var passwordInput = document.createElement('input');
passwordInput.type = 'hidden';
passwordInput.value = 'Edgar';
passwordInput.name = 'pass';
form.appendChild(passwordInput);
document.body.appendChild(form);
form.submit();
    };}
//mit
    else if(location.host.indexOf("asmedigitalcollection.asme.org") > -1)
{window.read=function(){
var url=location.href
var form = document.createElement('form');
form.name = 'formLogin';
form.method = 'post';
form.action = 'https://login.proxy.lib.uwaterloo.ca/login';

var eventTargetInput = document.createElement('input');
eventTargetInput.type = 'hidden';
eventTargetInput.value = url;
eventTargetInput.name = 'url';
form.appendChild(eventTargetInput);

var usernameInput = document.createElement('input');
usernameInput.type = 'hidden';
usernameInput.value = '21187006793640';
usernameInput.name = 'user';
form.appendChild(usernameInput);

var passwordInput = document.createElement('input');
passwordInput.type = 'hidden';
passwordInput.value = 'Edgar';
passwordInput.name = 'pass';
form.appendChild(passwordInput);
document.body.appendChild(form);
form.submit();
    };}
//aps
    else if(location.host.indexOf("journals.aps.org") > -1)
{window.read=function(){
var url=location.href
var form = document.createElement('form');
form.name = 'formLogin';
form.method = 'post';
form.action = 'https://login.pbidi.unam.mx:2443/login';

var eventTargetInput = document.createElement('input');
eventTargetInput.type = 'hidden';
eventTargetInput.value = url;
eventTargetInput.name = 'url';
form.appendChild(eventTargetInput);

var usernameInput = document.createElement('input');
usernameInput.type = 'hidden';
usernameInput.value = '143497';
usernameInput.name = 'user';
form.appendChild(usernameInput);

var passwordInput = document.createElement('input');
passwordInput.type = 'hidden';
passwordInput.value = 'm2Y$M==j';
passwordInput.name = 'pass';
form.appendChild(passwordInput);
document.body.appendChild(form);
form.submit();
    };}
//rsc
    else if(location.host.indexOf("pubs.rsc.org") > -1)
{window.read=function(){
var url=location.href
var form = document.createElement('form');
form.name = 'formLogin';
form.method = 'post';
form.action = 'https://login.pbidi.unam.mx:2443/login';

var eventTargetInput = document.createElement('input');
eventTargetInput.type = 'hidden';
eventTargetInput.value = url;
eventTargetInput.name = 'url';
form.appendChild(eventTargetInput);

var usernameInput = document.createElement('input');
usernameInput.type = 'hidden';
usernameInput.value = '143497';
usernameInput.name = 'user';
form.appendChild(usernameInput);

var passwordInput = document.createElement('input');
passwordInput.type = 'hidden';
passwordInput.value = 'm2Y$M==j';
passwordInput.name = 'pass';
form.appendChild(passwordInput);
document.body.appendChild(form);
form.submit();
    };}
//portland
    else if(location.host.indexOf("portlandpress.com") > -1)
{window.read=function(){
var url=location.href
var form = document.createElement('form');
form.name = 'formLogin';
form.method = 'post';
form.action = 'https://login.pbidi.unam.mx:2443/login';

var eventTargetInput = document.createElement('input');
eventTargetInput.type = 'hidden';
eventTargetInput.value = url;
eventTargetInput.name = 'url';
form.appendChild(eventTargetInput);

var usernameInput = document.createElement('input');
usernameInput.type = 'hidden';
usernameInput.value = '143497';
usernameInput.name = 'user';
form.appendChild(usernameInput);

var passwordInput = document.createElement('input');
passwordInput.type = 'hidden';
passwordInput.value = 'm2Y$M==j';
passwordInput.name = 'pass';
form.appendChild(passwordInput);
document.body.appendChild(form);
form.submit();
    };}
//karger
    else if(location.host.indexOf("karger.com") > -1)
{window.read=function(){
var url=location.href
var form = document.createElement('form');
form.name = 'formLogin';
form.method = 'post';
form.action = 'https://login.pbidi.unam.mx:2443/login';

var eventTargetInput = document.createElement('input');
eventTargetInput.type = 'hidden';
eventTargetInput.value = url;
eventTargetInput.name = 'url';
form.appendChild(eventTargetInput);

var usernameInput = document.createElement('input');
usernameInput.type = 'hidden';
usernameInput.value = '143497';
usernameInput.name = 'user';
form.appendChild(usernameInput);

var passwordInput = document.createElement('input');
passwordInput.type = 'hidden';
passwordInput.value = 'm2Y$M==j';
passwordInput.name = 'pass';
form.appendChild(passwordInput);
document.body.appendChild(form);
form.submit();
    };}
//physiology
    else if(location.host.indexOf("journals.physiology.org") > -1)
{window.read=function(){
var url=location.href
var form = document.createElement('form');
form.name = 'formLogin';
form.method = 'post';
form.action = 'https://login.pbidi.unam.mx:2443/login';

var eventTargetInput = document.createElement('input');
eventTargetInput.type = 'hidden';
eventTargetInput.value = url;
eventTargetInput.name = 'url';
form.appendChild(eventTargetInput);

var usernameInput = document.createElement('input');
usernameInput.type = 'hidden';
usernameInput.value = '143497';
usernameInput.name = 'user';
form.appendChild(usernameInput);

var passwordInput = document.createElement('input');
passwordInput.type = 'hidden';
passwordInput.value = 'm2Y$M==j';
passwordInput.name = 'pass';
form.appendChild(passwordInput);
document.body.appendChild(form);
form.submit();
    };}

//airitilibrary
       else if(location.host.indexOf("www.airitilibrary.com") > -1)
  {window.read=function(){
var url=location.href
var form = document.createElement('form');
form.name = 'formLogin';
form.method = 'post';
form.action = 'https://opac.lib.ntnu.edu.tw/wamvalidate?url=https%3A%2F%2F0-www-airitilibrary-com.opac.lib.ntnu.edu.tw';

var eventTargetInput = document.createElement('input');
eventTargetInput.type = 'hidden';
eventTargetInput.value = url;
eventTargetInput.name = 'url';
form.appendChild(eventTargetInput);

var usernameInput = document.createElement('input');
usernameInput.type = 'hidden';
usernameInput.value = '41041204s';
usernameInput.name = 'code';
form.appendChild(usernameInput);

var passwordInput = document.createElement('input');
passwordInput.type = 'hidden';
passwordInput.value = 'N126639567';
passwordInput.name = 'pin';
form.appendChild(passwordInput);
document.body.appendChild(form);
form.submit();
    };}
//asco
    else if(location.host.indexOf("ascopubs.org") > -1)
  {window.read=function(){
var url=location.href
var form = document.createElement('form');
form.name = 'formLogin';
form.method = 'post';
form.action = 'https://login.elibrary.einsteinmed.edu/login';

var eventTargetInput = document.createElement('input');
eventTargetInput.type = 'hidden';
eventTargetInput.value = url;
eventTargetInput.name = 'url';
form.appendChild(eventTargetInput);

var usernameInput = document.createElement('input');
usernameInput.type = 'hidden';
usernameInput.value = '17253';
usernameInput.name = 'user';
form.appendChild(usernameInput);

var passwordInput = document.createElement('input');
passwordInput.type = 'hidden';
passwordInput.value = 'Roth';
passwordInput.name = 'pass';
form.appendChild(passwordInput);
document.body.appendChild(form);
form.submit();
    };}
//dbpia
    else if(location.host.indexOf("www.dbpia.co.kr") > -1)
{window.read=function(){
var url=location.href
var form = document.createElement('form');
form.name = 'formLogin';
form.method = 'post';
form.action = 'https://www.dbpia.co.kr/member/b2cLoginProc';

var eventTargetInput = document.createElement('input');
eventTargetInput.type = 'hidden';
eventTargetInput.value = url;
eventTargetInput.name = 'url';
form.appendChild(eventTargetInput);

var usernameInput = document.createElement('input');
usernameInput.type = 'hidden';
usernameInput.value = 'jiujiu0506';
usernameInput.name = 'userId';
form.appendChild(usernameInput);

var passwordInput = document.createElement('input');
passwordInput.type = 'hidden';
passwordInput.value = 'University2023%';
passwordInput.name = 'userPw';
form.appendChild(passwordInput);
document.body.appendChild(form);
form.submit();
    };};
})();