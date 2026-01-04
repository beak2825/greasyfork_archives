// ==UserScript==
// @name        PTsign
// @description pt 自动签到
// @include     *hdhome*
// @include     *ourbits*
// @include     *hdupt*
// @include     *totheglory*
// @include     *lemonhd*
// @include     *btschool*
// @include     *nicept*
// @include     *pttime*
// @include     *pterclub*
// @grant none
// @version     1.7
// @namespace @github.com/lizhenghlh
// @downloadURL https://update.greasyfork.org/scripts/372581/PTsign.user.js
// @updateURL https://update.greasyfork.org/scripts/372581/PTsign.meta.js
// ==/UserScript==
(function (window) {
  var url = window.location.href
  setTimeout(function () {
    var ttgSign = document.getElementById('signed') || ''
    var hdcSign = document.getElementsByClassName('userinfort')[0] || ''
    if (hdcSign) {
      var hdc = hdcSign.getElementsByTagName('a')[1];
    }
    var ourSign = document.getElementsByClassName('faqlink')[0] || ''
    var hdhomeSign = document.getElementsByClassName('faqlink')[0] || ''
    var leamonSign = document.getElementsByClassName('faqlink')[0] || ''
    var schoolDoms = document.getElementsByTagName('a') || ''

    var niceptSign = document.getElementsByClassName('faqlink')[0] || ''
    var pttimeSign = document.getElementsByClassName('faqlink')[0] || ''
    var ptclubSign = document.getElementsByClassName('faqlink')[0] || ''
    var hdu = document.getElementById('qiandao') || ''
    if (hdu) {
      var hduSign = hdu.firstChild
    }
    var host = window.location.host
    if (host.indexOf('hdu') != -1) {
      qiandao('qiandao')
    }
    if (host.indexOf('ourbits') != -1 && ourSign.innerText.indexOf('签到得魔力') != -1) {
      ourSign.click()
    }
    if (host.indexOf('hdhome') != -1 && hdhomeSign.innerText.indexOf('签到得魔力') != -1) {
      hdhomeSign.click()
    }
    if (host.indexOf('lemonhd') != -1 && hdhomeSign.innerText.indexOf('签到') != -1) {
      leamonSign.click()
    }
    if (schoolDoms[25].href === 'https://pt.btschool.club/index.php?action=addbonus' && host.indexOf('btschool') != -1) {
      schoolDoms[25].click()
    }
    if (host.indexOf('nicept') != -1 && niceptSign.innerText.indexOf('簽到得魔力') != -1) {
      niceptSign.click()
    }
    if (host.indexOf('pttime') != -1 && pttimeSign.innerText.indexOf('签到领魔力') != -1) {
      pttimeSign.click()
    }
    if (host.indexOf('pterclub') != -1 && ptclubSign.innerText.indexOf('签到得猫粮') != -1) {
      ptclubSign.click()
    }
    if (host.indexOf('totheglory') != -1 && ttgSign.innerText.indexOf('签到') != -1) {
      ttgSign.click()
    }
  }, 500)
})(window)
