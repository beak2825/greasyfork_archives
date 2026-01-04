// ==UserScript==
// @name         横店影视职业学院校园网自动登录
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  横店影视职业学院校园网自动登录脚本，大家终于不必因断网而频繁的登陆啦,好耶 ！ ！ ！
// @author       陌笑颜栀子
// @match        *://1.1.1.2
// @match        *://1.1.1.2/chkuser?url=www.doctorcom.com/
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAYAAACOEfKtAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAElZJREFUeNrUXX1sldUZP63yoZZxmVsQoraiNDgVKswJCfTD6HTC0nYm+JVJcW4Z7I9CTCYkukIwQc1My5Jh3NQWjA5ctG1iXZy4toiZRKFF1DEatLApuM1xsfVzS7bzO+/z3Pu855733vd9770tnuTNvfTe+77n/M7v+TzPOZSocW5fu+PqWv1SQdc8fSXEx1X6SuprWPwN74/qaxDvP96+d3A8+18yToDV64uBAwD9BAyuZBAo9FsGtpxe8bc+fXXjdawBLRlD0Fboq4EGC8C69GCH6TMJCAOUsG6TJLAVvRoW6nv06XtU0b3r6Xdd+tqC+3+lAdQDa9IvLcSsbTSwCgKzVgCWbxskBnYR0ACzmZ67ESAXa4ylRQJug75O6rc1+mrU10rSbwN0rZHgLZ4zX009e4pa33hX4D0v/MYM8zm+x9+3dGUL3buX2FwHFuLvui/v6avhtGcgdbKVxHQjsa2F2JbRHrh9rVr13ZvN+0f+uNMAs/i+Hzrvjc+ebn7IvN9zaL869emIAXXp5tXZutRFICrqB9raQurJMwsEHIBqp382kh5qDwKO29Szy8zrsX8dV1dcOFv17O/XgN6iwdyR8d1Tn46a7/fs321e8ZuDx4Zyda1B6N2N1K9O3d8uEu3kuIsw6ble0kGNpHt6c4HHoAAIMOmKCysNyw4eO6zcbF1jvr90frURXwAOFgaJ+yM/vs+8UqulPtWTaKMNkPEZHwD1wxP6aifA6kh5v6evJh4ELoidGIivPb+v33wGYNBW/XaT+b6l30zb3PmYYSZEFr8B8E+90uO87+1LlpoJOfhwp7pt8VL5URPpyX7Sy716DGvyAfCMuODRjJ7Q161QYfpap6/JnmhOUUO/6lFLLl1gBonBvHHkLScDK2dWGDYNHT+q35erJ/7U6fwuQMF9b1p4nfriP1/Sd0rM7/xqYYpqbbpHTZ4w0dw/cc4UtXbZHeqw/h5Apz7eQl9H3zdPmnf+wi8OvN89JkaEaN9JOmWQdF2VFB+wyDBGixEUPkCEaNIAfG3p/Bqj057e0xO6D3gGAN364s4MMYZhYjHHZ4vvu0P350HTH/TF4f6sJCmCHm+MqhfPjAEemLeWfKxe2+HFrLOIARQWoVOfVhsRtRsMh93AWDYw8r6sH3FvAJJplKakAObJAnhsuR2Nx1PHuluPsS4KiCUxwVPC6mY0+GvGJdHXFXc3pnXhqmud7smSS+m7DuBcYg8gAcgrf9mfAQyetWfTk6nJAai3bfl5ruElaVw1BGpoEEsi6Lz3woDHDQo8zbLdhjEsbgALIsjim08DoAAKaoLBBIgAbtmCapX8ZNTpFgW0lQRihQawriAACoOxRYhtzgZ/LnFOmRkYixPEGewMssr5NhZt1qdgNCbNpXsBMPphuU1JIc5Kg7iyEAB2ilg2pfPAMMw4OhzUQWYcmAY/rljAuYCEvg3Qe6QbHzLfgzRgkgVLGURI2TYNYltsAMlHqicHeYAslXm4F4+Wec6t9s1cDjBAhCWGVRyPBtUBIKWlZv8U1toQQfcbTF33VKsEfFCMuS5b6Feaw2i00I3AwgoAAjYBPNkpsMtlHMDS8QLPY3616QP6IpkHowXfk31Uz80asq1zK4+d1FjkSKSdlGqTDMvAKFccyoE+67+e9VvzNhCFaCZ+1n1hdwrSAhKAndDHIAJ7DY44uooSEi2RRJhEt4as7gDrPVAfD+K0EsexUoQBsBU+nTYNGR+IKlgHUGG9OSR06XGhDzvJyR7MGcoRXdspzMHrHL8PNmSuO69pVC8ffM2EXng93cFDu+riy1X5N2eoJ3o71S7dZ4R4655qCwKPw77z9AVvvEWHe9tyMhDJUKFIO4P1S43RJVtf3OFZPS22Ll342Zej6tVDO1P/XnDxjWraOWlr/O6HA/pyW8tr5/7I9+99776gTo4eDwXWtLIZasGsG90uFpIW2tWREUuOVkdijGWCrsBQjvJ68IEuItHNYuH6U2EYuymu9puXfqY+OJnWl7Omz7cA3K9eevPxUAC+ceSFQLBdDWDb95B6PJubY7VWUmftpBMDjUgTOcwN7LKECezRoaAmwRvrduTDgax+oCttxqEoLkiVsMrAY1isDPoBJN0H9rVJqwOFm1Uxa/DysbbjBbDJAFGiQaolXEf/6TnYCAWFdV5B5GoJYmAD0bNKss9+iIwmYDAc5j9Sg44cr4a+S6MHkQbz2EWzFq9qySpXkKrLALCZEF4hAWIR5Zuxv4f37M1HaTOmzT6tLDO7ZCnHW7tjHHYCULwXUsgsbPYBSIgmKOZt4g+XLagxCUmkjQDWnk3bU4Zj9fU3xxLdsyaWnVYAAiiMhbPenFbjZQZYaxGm8gJVg81AFt8Gmdn1Yt0RcxMsN+KmcDoxY0LBfuUbi/FtW+4xl1kd1K4OEiXWukuC1FuSF6TYjamxqYkfYkbgsYPKAI3T8nhgocK0mVqko7gmxWIhxuSxbYRyl6NBq35IrnSTThxkBtZS+UPKRAMsE/bc3WhmA4BBlD3xjc8+2+qeLiINdSXTYUFLpkJa6w0Dya8ZJEoGZh24AsBbw41vCD6PYHVPfnLc53RfPP3KorFVLkTlaAlhlY0OBHD9KsRCOPtKhWwIuYIjiRP+wLTIbI2QegNmpioMAJZT3DsvzC8R/+bTbAZJhmWK+2FLX1YWFcAIY5tHmFUwA4fDhm5RxRexbzYdOEuLZVh9ie8WU2dGCAqAGVb0q2CFsQLFOtA4ysiwwMHkYBuhDSwUL8TkY2VdOgwgu/7+zt92K7XI/7dvXVCt9h15oWjWWLpxANQrPRlJGReyBQli4IpSwTyjHFGvAivLyVM5K3GMh80whG5vAxjRLrtgSWCYhxSWbNc5sivFYCFIA7AAGi5OIAsGKhbhPnkDXqmSmYp89N5lmjG2odhz6BnfvxfMWhoomnaqCzpz8Zybi+7WQPrgA/OyKCSQoxM0rnrlUK5W0hg/wjIfx4P5AmmzBuL6rkg1AbwgUJDTe+bP9/v+9v1vN5vEbHGyNOnyEIydV/EgmS4rXZrtRshKwG1582h+KSdkhu0Bb++/x2ckkPgMAgU6DyDKzM3yRfcaIAttVOaWz07F+lw6AgYiKpMFUOw3O4uLEA/iBlwMVIilSQyYwWD9hmz1T677tTE0/J2zJkzRnd7pBBGsXTxnuacWSJQh/u/8fbf64N9DvgmZVnaedrzjqx5UfqExBg7jCZuRKNFIotoApWo5SzZgmdc13JWnHzhgAJKGBMy77PxqNfPrsw0wiEB2vPq4OpE8rsEt8UUiKQacfaVq7+0xy5NcL82VrlA1cScdi0wha2mm6auTGRiq6BqWKWpjK+a3zMtV/VX3qo9G/KoBgO14dXdqocrvf6IEeMRIBrPhO5fMN4odLOElSogc62+4ZFE9h6ASY7uhekuTT4GBJ/U/punX/4Ux8bBMkZTyioVZnPJKo1u4Ul82rOHKii6pm5HktJdPeaUt3/7CdQm52ARxaC2NyqZCNpnxsSsdAKpX3eBf+AGgLrAKtSYdovIfLUk6MFlKmZgK2x8cCwDlfb3qhqGMsDGIQa7qK0QPuRbBsrUsOUC7DVIAcqBUxMGhKjIjrKVG7PyIAVE6qwxi0A4mr/JqVIh3WeD6dCH1n8BsuJSCYjjSB8YTQAYRIp1hGRvcRZlgrm0x7ZW2qNFHyAbMahjAPkrP9LmUvFeykV59e37f7qKGUF5aPVMPBWXBvUr90Qx3K06TY8O4YcW95YuMBXhgVYVwrpTkucp2ZdAJKGa4DQhjJM2LpQvToGT6YUGs4rDTzqpETfx6JXuHfWzkJV1H5cUwXaqUqtGTKr35OTWzGAj7U7JDcF6jxpZRmuv+0G9BoLh2LME9isp82WcUFED/wp2ytmeAfby8mYqFeZWpW84sPHqIE97LDrkYEuhXxYgI8DwXiCi1CGKP/X08N4pFlpPABQVc/2itQHaT/uuWAGKVaYWyKo94kQUgYjZYkXN6J0yTK/9RGq8Ahs0YSzUTVRdiLFItYaKQD+AxWioLzKv1pbOo8jKh/NvqfZWb3k7JtAi5dgoFZXnjuBYui8jxbhSxD9PkWDBGjJXjfks9sL3ocqWzUH3ZpNIblE18yZlppjSzKQoLzaJ1lnKyKD5ZkFhCUuK4WNBxkmFQW7gXwMdn1lY0rh3a5gKwQ3mVCV3SqUZ2wtsy5Tmpclbxme1CZNOFqK2JUs3lAoTzdYXwUdF3yT4mCqfvLTXC0lkhz2AoFdmFYZWuj9kimWCKsklEEFqxGHFcGrbhd/h9WDa63KWgCYjjQNt7SEwxFd3f9DWTfc2U+gvMSHMBYZtkIQqLYES4wFwOAg+JslWV2Yj9G7mUvAtAWwdyyZ2c2LCiKwEC+LgAKBdUWewz5NJE6wgEkIzJoM1CprtX+jWb9uTW+GYyZBbDp+ChpB27yrNaYrvAM85mHoi6DBl51zyAg/+LSeGMdDb2obmq9CtUeg9tao8Ip4wgzvADzW5LcWIGHgoWxK2bwQRY263Ms6A3XVljq/w20nO8pMWIr9+cuDAS5j85BKoNG47aNcEuygkggYjpOaWsrQ5gHltl6EbMmtyLmy+I7I4AyJT7tO21AuYf/eAxKbjvqU04ft3HB2lkbHFAc56ZMGne+Xv1y++IuthoYjbbYHPKpAkT1fTEueaBsGAemJ744iyDZ/fuUtfOXaSmTz031iArZ5Rrdi9TH576yNwXij3uvXKBx8AhUYEJw8abDb/fasYhAgwQaY4Gb73rvk4Avzjw/ucaxL+q9Ia7nyo6UAKswwB5j9nc8kpa2Bn1gQiQ4yY3cWAEgMOuIoCXL4AwCDf9co0ExuhPAPdA12Pq9SNvqQ3LV5voQxxiAdFdxRhoTJz50lzbXdvJAnUrsWrHaxnoBFgIICHKth+Gz7lUeDyaXHCy+wXwoIbYKCGVZWV1sObRTqLbEfSMrMeeaBbiyRv0BTbi/Q34+z+0eOEYkTuv+YHx3AFQSQms2UzfkSUQm2f3vqSZNNOI5lg2SIVrHzMmG5MKpqF/HGFBdEWD0cBK1wkN3sZsz8kKIIky9CHOhXmQxLiKZxcggnVeeWyJWv90m09M+HsAEd+DSBZ71zqeA9a19mzP6AsMBhKlABYMxOcAcm2Hby9MB2Wc4crdCgxiA0ggniAm9pJOSIHo6YsSddUll6cUNGb3idX3G3DloTgcO2OAYGs+iz8uUX1OTxLcG+i0oIQvDMbHn40avY1dppMnTrKXEDpI0hBMLApzckeUY0+aSKHyoQxNmRFGjZfF0J3CbAOwoL243u736tSRJ1GZyYvocLa5OsEZrmnG4Xssyuxqec7/YRd4ZoxhT3iLdHJRLhDRWTi4AA1M5C2lGGSucglZmoHTPlwNR5hg0JzkzdV4YR0A43dZUnCxwIsMoAPEBmVtvuPjTszhX7rTfDaM2S4RcLRdIRuey16B0Ymbnkyx2+UpKG8bazIOeKF0oEMnDmqd+CJFKN2UG7uB/URYYekAm8PAnt9u5grpMATxGCAGCmseNh2Wbc2Fn3Pw4S4j2lgI47I0+KP4HPqRd9aLBMH39HW18g4juzLOmauxT7Ck+rh2SnFvUY4DFzEoxLI866gzBAOPPbLL2z5Gp3/AB+NK0DDiySyHSMMfNbunwC7NNoSRrB+zpNr6OL4lIFfGPYzxjLgAknXeSWK8hiw0/MWFzEa4CWAcgISxwPF2sID4N8R68oRJhhU40g7X5IkTTagIEMFS6C+4PkhXgdGvH3nbsPblX3gnscHSe0eYVJpzEPBdPBMRBZ7hOEYvSf2EvvuDvh7VwK3N5apka3mdYIlZo+ORuL4wQR58hx1Kwc2BGKFEDuDxQpV0Z8w5qZSHQ6oLv8HfmFFsNTknyZGE+YzO6uKTlBy6to30dj3p7bpcpxIVlYEWGw9pNj6q316PpA3pxbUEaOpsQbAHrAArPSd8wLBm15uvGSY9p2PoXaSnjKP73y8No8BUWTOIZAX0KoBE0sGcwLHtQfPqcJk6SFyRitqsr52YdEhQIcZe8HOkKZ/YSsBtJH3TRIsxFbncGNaXsN5Y/4B+BFMjZr2HVfrcaj5TGnq6rRAHzxYVQMvINIvsdgeBKo+BL2QbVukj4YftZxfrVPOiHwVPjGQGJokZffQxgJxHYNZGvHUfAXWA3idochroOQCuq9CMG3MAHayUZ94PCgCGaeC5jibm4sYK+i6fOtmnxBn9YzWmMf/fHASYbGDAvHIBCIPkarUqXRnl+w8Jxmsc/xdgALrmBgvQ3TubAAAAAElFTkSuQmCC
// @grant
// @downloadURL https://update.greasyfork.org/scripts/434474/%E6%A8%AA%E5%BA%97%E5%BD%B1%E8%A7%86%E8%81%8C%E4%B8%9A%E5%AD%A6%E9%99%A2%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/434474/%E6%A8%AA%E5%BA%97%E5%BD%B1%E8%A7%86%E8%81%8C%E4%B8%9A%E5%AD%A6%E9%99%A2%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==
//var flag = "true";
//function onlyOne() {
//    if(flag) {
    setTimeout(function(){

    //账号

    document.querySelector ("#edit_body > div:nth-child(3) > div.edit_loginBox.random.loginuse.loginuse_pc.ui-resizable-autohide > form > input:nth-child(4)").value = "输入账号";

    //密码

    document.querySelector ("#edit_body > div:nth-child(3) > div.edit_loginBox.random.loginuse.loginuse_pc.ui-resizable-autohide > form > input:nth-child(5)").value = "输入密码";

    //运营商

    var 其他网=document.querySelector ("#edit_body > div:nth-child(3) > div.edit_loginBox.random.loginuse.loginuse_pc.ui-resizable-autohide > select > option:nth-child(3)");

    var 校园网=document.querySelector ("#edit_body > div:nth-child(3) > div.edit_loginBox.random.loginuse.loginuse_pc.ui-resizable-autohide > select > option:nth-child(2)");

    校园网.selected = true

    其他网.selected = false

    //”我已阅读并同意《免责声明》“默认勾选

     document.querySelector ("#edit_body > div:nth-child(3) > div.edit_loginBox.random.loginuse.loginuse_pc.ui-resizable-autohide > form > input.edit_lobo_cell.agree").checked = "checked";


    //保存密码默认勾选

    document.querySelector ("#edit_body > div:nth-child(3) > div.edit_loginBox.random.loginuse.loginuse_pc.ui-resizable-autohide > form > input.edit_lobo_cell.draggable").checked = "checked"


    //登录按钮触发

    //document.querySelector ("#edit_body > div:nth-child(3) > div.edit_loginBox.random.loginuse.loginuse_pc.ui-resizable-autohide > form > input:nth-child(2)").click();


},1000);
//             }
//   flag = "false"; }

