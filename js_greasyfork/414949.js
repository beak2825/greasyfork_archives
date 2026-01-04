// ==UserScript==
// @name         愛sharing集雪鈴活動
// @namespace    http://tampermonkey.net/
// @version      1.8
// @author       
// @match        https://www.i-sharing.com.tw/share/main
// @grant        none
// @description try to take over the world!
// @downloadURL https://update.greasyfork.org/scripts/414949/%E6%84%9Bsharing%E9%9B%86%E9%9B%AA%E9%88%B4%E6%B4%BB%E5%8B%95.user.js
// @updateURL https://update.greasyfork.org/scripts/414949/%E6%84%9Bsharing%E9%9B%86%E9%9B%AA%E9%88%B4%E6%B4%BB%E5%8B%95.meta.js
// ==/UserScript==

// game
fetch("https://www.i-sharing.com.tw/game/sharetimeResult",{"headers":{},"method":"POST",});

// sendcard
fetch("https://www.i-sharing.com.tw/collect/sendcard/",{"headers":{"Content-Type":"application/x-www-form-urlencoded;charset=UTF-8",},"body":"type=line&sendCardId=4lqub4e-635682ea295d53-73238982","method":"POST",});
fetch("https://www.i-sharing.com.tw/collect/sendcard/",{"headers":{"Content-Type":"application/x-www-form-urlencoded;charset=UTF-8",},"body":"type=line&sendCardId=4lqub43-6356839f9e2bd3-25036601","method":"POST",});
fetch("https://www.i-sharing.com.tw/collect/sendcard/",{"headers":{"Content-Type":"application/x-www-form-urlencoded;charset=UTF-8",},"body":"type=line&sendCardId=4lqub6s-63568400c6a7c1-61107100","method":"POST",});
fetch("https://www.i-sharing.com.tw/collect/sendcard/",{"headers":{"Content-Type":"application/x-www-form-urlencoded;charset=UTF-8",},"body":"type=line&sendCardId=4lquacu-6356842ed135d4-11661272","method":"POST",});
fetch("https://www.i-sharing.com.tw/collect/sendcard/",{"headers":{"Content-Type":"application/x-www-form-urlencoded;charset=UTF-8",},"body":"type=line&sendCardId=4lqub6d-635684513e3303-16478031","method":"POST",});
fetch("https://www.i-sharing.com.tw/collect/sendcard/",{"headers":{"Content-Type":"application/x-www-form-urlencoded;charset=UTF-8",},"body":"type=line&sendCardId=4lqub4i-635684731f56b6-68209063","method":"POST",});
fetch("https://www.i-sharing.com.tw/collect/sendcard/",{"headers":{"Content-Type":"application/x-www-form-urlencoded;charset=UTF-8",},"body":"type=line&sendCardId=4lquact-63568492b0d2e3-36063740","method":"POST",});
fetch("https://www.i-sharing.com.tw/collect/sendcard/",{"headers":{"Content-Type":"application/x-www-form-urlencoded;charset=UTF-8",},"body":"type=line&sendCardId=4lquacd-635684b076d301-19107242","method":"POST",});
fetch("https://www.i-sharing.com.tw/collect/sendcard/",{"headers":{"Content-Type":"application/x-www-form-urlencoded;charset=UTF-8",},"body":"type=line&sendCardId=4lqub1x-635684ce7fbe24-19792261","method":"POST",});
fetch("https://www.i-sharing.com.tw/collect/sendcard/",{"headers":{"Content-Type":"application/x-www-form-urlencoded;charset=UTF-8",},"body":"type=line&sendCardId=4lqub4i-635684e70bf5e2-87108671","method":"POST",});

// puzzle (10/24)
fetch("https://www.i-sharing.com.tw/collect/puzzle",{"headers":{"Content-Type":"application/x-www-form-urlencoded;charset=UTF-8",},"body":"bu_site_id=cosmed&puzzle_id=cosmed-puzzle-1","method":"POST",});
fetch("https://www.i-sharing.com.tw/collect/puzzle",{"headers":{"Content-Type":"application/x-www-form-urlencoded;charset=UTF-8",},"body":"bu_site_id=cosmed&puzzle_id=cosmed-puzzle-1","method":"POST",});
fetch("https://www.i-sharing.com.tw/collect/puzzle",{"headers":{"Content-Type":"application/x-www-form-urlencoded;charset=UTF-8",},"body":"bu_site_id=beautydiary&puzzle_id=beautydiary-puzzle-1","method":"POST",});
fetch("https://www.i-sharing.com.tw/collect/puzzle",{"headers":{"Content-Type":"application/x-www-form-urlencoded;charset=UTF-8",},"body":"bu_site_id=beautydiary&puzzle_id=beautydiary-puzzle-1","method":"POST",});
fetch("https://www.i-sharing.com.tw/collect/puzzle",{"headers":{"Content-Type":"application/x-www-form-urlencoded;charset=UTF-8",},"body":"bu_site_id=ksolite&puzzle_id=ksolite-puzzle-1","method":"POST",});
fetch("https://www.i-sharing.com.tw/collect/puzzle",{"headers":{"Content-Type":"application/x-www-form-urlencoded;charset=UTF-8",},"body":"bu_site_id=ksolite&puzzle_id=ksolite-puzzle-1","method":"POST",});
