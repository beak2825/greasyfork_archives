// ==UserScript==
// @name         2021 isharing 雲朵遊戲
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  2021 isharing 雲朵遊戲 3小時一次
// @author       You
// @match        https://www.i-sharing.com.tw/share/main
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      crhis
// @downloadURL https://update.greasyfork.org/scripts/434482/2021%20isharing%20%E9%9B%B2%E6%9C%B5%E9%81%8A%E6%88%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/434482/2021%20isharing%20%E9%9B%B2%E6%9C%B5%E9%81%8A%E6%88%B2.meta.js
// ==/UserScript==

fetch("https://www.i-sharing.com.tw/game/sharetimeDarw", {
    "headers": {
        "Content-Type": "application/json;charset=utf-8",
    },
    "method": "POST",
})
.then((response) => {
    return response.json();
  })
  .then((data) => {
    console.log("已完成雲朵遊戲",data);
  });

fetch("https://www.i-sharing.com.tw/game/sharetimeResult", {
    "headers": {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    },
    "body": "score=2000",
    "method": "POST",
})
.then((response) => {
    return response.json();
  })
  .then((data) => {
    console.log("已完成雲朵遊戲",data.msg,"總雪鈴數：",data.totalPoint);
  });

// sendcard ＊Thanks, @kwei!
fetch("https://www.i-sharing.com.tw/collect/sendcard/",{"headers":{"Content-Type":"application/x-www-form-urlencoded;charset=UTF-8",},"body":"type=line&sendCardId=4lq8vfz-6173c712184592-59658286","method":"POST",});
fetch("https://www.i-sharing.com.tw/collect/sendcard/",{"headers":{"Content-Type":"application/x-www-form-urlencoded;charset=UTF-8",},"body":"type=line&sendCardId=4lq8utn-6173cc09d91f15-90795504","method":"POST",});
fetch("https://www.i-sharing.com.tw/collect/sendcard/",{"headers":{"Content-Type":"application/x-www-form-urlencoded;charset=UTF-8",},"body":"type=line&sendCardId=4lq8upz-6173cc68571be8-72840045","method":"POST",});
fetch("https://www.i-sharing.com.tw/collect/sendcard/",{"headers":{"Content-Type":"application/x-www-form-urlencoded;charset=UTF-8",},"body":"type=line&sendCardId=4lq8urb-6173ccb1407f85-68909441","method":"POST",});
fetch("https://www.i-sharing.com.tw/collect/sendcard/",{"headers":{"Content-Type":"application/x-www-form-urlencoded;charset=UTF-8",},"body":"type=line&sendCardId=4lq8vj8-6173ccee6f02f9-22064362","method":"POST",});
fetch("https://www.i-sharing.com.tw/collect/sendcard/",{"headers":{"Content-Type":"application/x-www-form-urlencoded;charset=UTF-8",},"body":"type=line&sendCardId=4lq8uqf-6173cd2fc368c0-54012579","method":"POST",});
fetch("https://www.i-sharing.com.tw/collect/sendcard/",{"headers":{"Content-Type":"application/x-www-form-urlencoded;charset=UTF-8",},"body":"type=line&sendCardId=4lq8vl4-6173cd910a7fa2-43905954","method":"POST",});
fetch("https://www.i-sharing.com.tw/collect/sendcard/",{"headers":{"Content-Type":"application/x-www-form-urlencoded;charset=UTF-8",},"body":"type=line&sendCardId=4lq8upz-6173cdc3af6f14-05062676","method":"POST",});
fetch("https://www.i-sharing.com.tw/collect/sendcard/",{"headers":{"Content-Type":"application/x-www-form-urlencoded;charset=UTF-8",},"body":"type=line&sendCardId=4lq8uqf-6173ce14b7f121-68415543","method":"POST",});
fetch("https://www.i-sharing.com.tw/collect/sendcard/",{"headers":{"Content-Type":"application/x-www-form-urlencoded;charset=UTF-8",},"body":"type=line&sendCardId=4lq8upz-6173ce39b94f58-70631792","method":"POST",});
fetch("https://www.i-sharing.com.tw/collect/sendcard/",{"headers":{"Content-Type":"application/x-www-form-urlencoded;charset=UTF-8",},"body":"type=line&sendCardId=4lq8uqf-6173ce6517c0e2-88588422","method":"POST",});

// puzzle (12/18)
fetch("https://www.i-sharing.com.tw/collect/puzzle",{"headers":{"Content-Type":"application/x-www-form-urlencoded;charset=UTF-8",},"body":"bu_site_id=coldstone&puzzle_id=coldstone-puzzle-1","method":"POST",});
fetch("https://www.i-sharing.com.tw/collect/puzzle",{"headers":{"Content-Type":"application/x-www-form-urlencoded;charset=UTF-8",},"body":"bu_site_id=coldstone&puzzle_id=coldstone-puzzle-1","method":"POST",});
fetch("https://www.i-sharing.com.tw/collect/puzzle",{"headers":{"Content-Type":"application/x-www-form-urlencoded;charset=UTF-8",},"body":"bu_site_id=rosebeauty&puzzle_id=rosebeauty-puzzle-1","method":"POST",});
fetch("https://www.i-sharing.com.tw/collect/puzzle",{"headers":{"Content-Type":"application/x-www-form-urlencoded;charset=UTF-8",},"body":"bu_site_id=rosebeauty&puzzle_id=rosebeauty-puzzle-1","method":"POST",});

// --我是分隔線--

// ⚠️ Experimental (12/18)
fetch("https://www.i-sharing.com.tw/collect/puzzle",{"headers":{"Content-Type":"application/x-www-form-urlencoded;charset=UTF-8",},"body":"bu_site_id=coldstone&puzzle_id=coldstone-puzzle-2","method":"POST",});
fetch("https://www.i-sharing.com.tw/collect/puzzle",{"headers":{"Content-Type":"application/x-www-form-urlencoded;charset=UTF-8",},"body":"bu_site_id=coldstone&puzzle_id=coldstone-puzzle-2","method":"POST",});
fetch("https://www.i-sharing.com.tw/collect/puzzle",{"headers":{"Content-Type":"application/x-www-form-urlencoded;charset=UTF-8",},"body":"bu_site_id=coldstone&puzzle_id=coldstone-puzzle-3","method":"POST",});
fetch("https://www.i-sharing.com.tw/collect/puzzle",{"headers":{"Content-Type":"application/x-www-form-urlencoded;charset=UTF-8",},"body":"bu_site_id=coldstone&puzzle_id=coldstone-puzzle-3","method":"POST",});
fetch("https://www.i-sharing.com.tw/collect/puzzle",{"headers":{"Content-Type":"application/x-www-form-urlencoded;charset=UTF-8",},"body":"bu_site_id=coldstone&puzzle_id=coldstone-puzzle-4","method":"POST",});
fetch("https://www.i-sharing.com.tw/collect/puzzle",{"headers":{"Content-Type":"application/x-www-form-urlencoded;charset=UTF-8",},"body":"bu_site_id=coldstone&puzzle_id=coldstone-puzzle-4","method":"POST",});
fetch("https://www.i-sharing.com.tw/collect/puzzle",{"headers":{"Content-Type":"application/x-www-form-urlencoded;charset=UTF-8",},"body":"bu_site_id=coldstone&puzzle_id=coldstone-puzzle-5","method":"POST",});
fetch("https://www.i-sharing.com.tw/collect/puzzle",{"headers":{"Content-Type":"application/x-www-form-urlencoded;charset=UTF-8",},"body":"bu_site_id=coldstone&puzzle_id=coldstone-puzzle-5","method":"POST",});
fetch("https://www.i-sharing.com.tw/collect/puzzle",{"headers":{"Content-Type":"application/x-www-form-urlencoded;charset=UTF-8",},"body":"bu_site_id=coldstone&puzzle_id=coldstone-puzzle-6","method":"POST",});
fetch("https://www.i-sharing.com.tw/collect/puzzle",{"headers":{"Content-Type":"application/x-www-form-urlencoded;charset=UTF-8",},"body":"bu_site_id=coldstone&puzzle_id=coldstone-puzzle-6","method":"POST",});
fetch("https://www.i-sharing.com.tw/collect/puzzle",{"headers":{"Content-Type":"application/x-www-form-urlencoded;charset=UTF-8",},"body":"bu_site_id=coldstone&puzzle_id=coldstone-puzzle-7","method":"POST",});
fetch("https://www.i-sharing.com.tw/collect/puzzle",{"headers":{"Content-Type":"application/x-www-form-urlencoded;charset=UTF-8",},"body":"bu_site_id=coldstone&puzzle_id=coldstone-puzzle-7","method":"POST",});
fetch("https://www.i-sharing.com.tw/collect/puzzle",{"headers":{"Content-Type":"application/x-www-form-urlencoded;charset=UTF-8",},"body":"bu_site_id=coldstone&puzzle_id=coldstone-puzzle-8","method":"POST",});
fetch("https://www.i-sharing.com.tw/collect/puzzle",{"headers":{"Content-Type":"application/x-www-form-urlencoded;charset=UTF-8",},"body":"bu_site_id=coldstone&puzzle_id=coldstone-puzzle-8","method":"POST",});
fetch("https://www.i-sharing.com.tw/collect/puzzle",{"headers":{"Content-Type":"application/x-www-form-urlencoded;charset=UTF-8",},"body":"bu_site_id=rosebeauty&puzzle_id=rosebeauty-puzzle-2","method":"POST",});
fetch("https://www.i-sharing.com.tw/collect/puzzle",{"headers":{"Content-Type":"application/x-www-form-urlencoded;charset=UTF-8",},"body":"bu_site_id=rosebeauty&puzzle_id=rosebeauty-puzzle-2","method":"POST",});
fetch("https://www.i-sharing.com.tw/collect/puzzle",{"headers":{"Content-Type":"application/x-www-form-urlencoded;charset=UTF-8",},"body":"bu_site_id=rosebeauty&puzzle_id=rosebeauty-puzzle-3","method":"POST",});
fetch("https://www.i-sharing.com.tw/collect/puzzle",{"headers":{"Content-Type":"application/x-www-form-urlencoded;charset=UTF-8",},"body":"bu_site_id=rosebeauty&puzzle_id=rosebeauty-puzzle-3","method":"POST",});
fetch("https://www.i-sharing.com.tw/collect/puzzle",{"headers":{"Content-Type":"application/x-www-form-urlencoded;charset=UTF-8",},"body":"bu_site_id=rosebeauty&puzzle_id=rosebeauty-puzzle-4","method":"POST",});
fetch("https://www.i-sharing.com.tw/collect/puzzle",{"headers":{"Content-Type":"application/x-www-form-urlencoded;charset=UTF-8",},"body":"bu_site_id=rosebeauty&puzzle_id=rosebeauty-puzzle-4","method":"POST",});
fetch("https://www.i-sharing.com.tw/collect/puzzle",{"headers":{"Content-Type":"application/x-www-form-urlencoded;charset=UTF-8",},"body":"bu_site_id=rosebeauty&puzzle_id=rosebeauty-puzzle-5","method":"POST",});
fetch("https://www.i-sharing.com.tw/collect/puzzle",{"headers":{"Content-Type":"application/x-www-form-urlencoded;charset=UTF-8",},"body":"bu_site_id=rosebeauty&puzzle_id=rosebeauty-puzzle-5","method":"POST",});
fetch("https://www.i-sharing.com.tw/collect/puzzle",{"headers":{"Content-Type":"application/x-www-form-urlencoded;charset=UTF-8",},"body":"bu_site_id=rosebeauty&puzzle_id=rosebeauty-puzzle-6","method":"POST",});
fetch("https://www.i-sharing.com.tw/collect/puzzle",{"headers":{"Content-Type":"application/x-www-form-urlencoded;charset=UTF-8",},"body":"bu_site_id=rosebeauty&puzzle_id=rosebeauty-puzzle-6","method":"POST",});
fetch("https://www.i-sharing.com.tw/collect/puzzle",{"headers":{"Content-Type":"application/x-www-form-urlencoded;charset=UTF-8",},"body":"bu_site_id=rosebeauty&puzzle_id=rosebeauty-puzzle-7","method":"POST",});
fetch("https://www.i-sharing.com.tw/collect/puzzle",{"headers":{"Content-Type":"application/x-www-form-urlencoded;charset=UTF-8",},"body":"bu_site_id=rosebeauty&puzzle_id=rosebeauty-puzzle-7","method":"POST",});
fetch("https://www.i-sharing.com.tw/collect/puzzle",{"headers":{"Content-Type":"application/x-www-form-urlencoded;charset=UTF-8",},"body":"bu_site_id=rosebeauty&puzzle_id=rosebeauty-puzzle-8","method":"POST",});
fetch("https://www.i-sharing.com.tw/collect/puzzle",{"headers":{"Content-Type":"application/x-www-form-urlencoded;charset=UTF-8",},"body":"bu_site_id=rosebeauty&puzzle_id=rosebeauty-puzzle-8","method":"POST",});
