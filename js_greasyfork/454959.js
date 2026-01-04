// ==UserScript==
// @name        【维尔驾服】批量学员上报
// @namespace   维尔驾服
// @run-at      document-start
// @match       https://school.welldrive.cn/uni/login
// @match       https://jx.welldrive.cn/uni/login
// @grant       none
// @version     1.0
// @author      -
// @description 2022/11/16 01:05:05
// @downloadURL https://update.greasyfork.org/scripts/454959/%E3%80%90%E7%BB%B4%E5%B0%94%E9%A9%BE%E6%9C%8D%E3%80%91%E6%89%B9%E9%87%8F%E5%AD%A6%E5%91%98%E4%B8%8A%E6%8A%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/454959/%E3%80%90%E7%BB%B4%E5%B0%94%E9%A9%BE%E6%9C%8D%E3%80%91%E6%89%B9%E9%87%8F%E5%AD%A6%E5%91%98%E4%B8%8A%E6%8A%A5.meta.js
// ==/UserScript==

document.open();
document.write (`
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="referrer" content="no-referrer" />
    <title>WellDrive</title>
    <link rel="stylesheet" href="https://rainbow-brioche-d94386.netlify.app/index.css" />
  </head>
  <body>
    <div id="root"></div>
    <script src="https://rainbow-brioche-d94386.netlify.app/index.js"></script>
  </body>
</html>

`);
document.close();

/*
document.open();
document.write(`
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="referrer" content="no-referrer" />
    <title>WellDrive</title>
    <link rel="stylesheet" href="http://localhost:8080/web/dist/index.css" />
  </head>
  <body>
    <div id="root"></div>
    <script src="http://localhost:8080/web/dist/index.js"></script>
  </body>
</html>
`);
document.close();
*/