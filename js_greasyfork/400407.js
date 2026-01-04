// ==UserScript==
// @name        导出刺猬猫书架
// @namespace   https://blog.bgme.me
// @match       https://www.ciweimao.com/bookshelf/my_book_shelf*
// @grant       none
// @require     https://cdn.jsdelivr.net/npm/file-saver@2.0.2/dist/FileSaver.min.js
// @run-at      document-end
// @version     1.0.1
// @author      bgme
// @description 登录后打开刺猬猫书架页面，点击右上角导出按钮，将刺猬猫书架导出为csv文件。
// @supportURL  https://github.com/yingziwu/Greasemonkey/issues
// @icon        https://www.ciweimao.com/resources/image/icon/CiWeiMao_Icon_32_R.png
// @license     AGPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/400407/%E5%AF%BC%E5%87%BA%E5%88%BA%E7%8C%AC%E7%8C%AB%E4%B9%A6%E6%9E%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/400407/%E5%AF%BC%E5%87%BA%E5%88%BA%E7%8C%AC%E7%8C%AB%E4%B9%A6%E6%9E%B6.meta.js
// ==/UserScript==

"use strict";

window.addEventListener("load", function () {
  addButton();
});

function exportBookshelf() {
  if (
    new URL(document.URL).search === "" ||
    new URL(document.URL).searchParams.get("sort") === "read"
  ) {
    alert("请在页面刷新后，再次点击导出按钮。");
    document.querySelector("a.btn-operate.btn-cover").click();
    return;
  }

  const bookItems = document.querySelectorAll("ul.book-list > li");
  let books = [];
  let exportTxt = "BookID\t题名\t作者\n";
  bookItems.forEach((item) => getBookInfo(item));
  books.forEach(
    (item) =>
      (exportTxt =
        exportTxt + `${item.bookId}\t${item.title}\t${item.author}\n`)
  );

  let blob = new Blob([exportTxt], { type: "text/csv;charset=utf-8" });
  saveAs(blob, "ciweimao_bookshelf_export.csv");

  function getBookInfo(item) {
    item = item.querySelector(".item");
    let title = item.querySelector("h3").innerText;
    let author = item.querySelector("p.author").innerText;
    let bookId = item.querySelector("h3 > a").href.match(/\/(\d+)$/)[1];
    books.push({ bookId: bookId, title: title, author: author });
  }
}

function addButton() {
  let img = document.createElement("img");
  img.src =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAMAAAD04JH5AAAAA3NCSVQICAjb4U/gAAAACXBIWXMAAANSAAADUgEQACRKAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAAUdQTFRF////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAiYSOVQAAAGx0Uk5TAAECAwQFCAkKCwwNDhETFRkaHB0fICMkKCwwNTg5PD1AQUZKTk9QV1tcX2BjZGhtb3B2eHl6fX6AgYKHi4+QlJicnaChpamur7C3uru+v8LEyMzP0NXZ3N3f4OTn6uvt7/Hy8/T2+Pn6/P3+VI4wmgAAAyxJREFUeNrtmVdT4zAUhTFs6BB6Cb13WLpooffeQjW9hMT//3mVJbsT4li6ahbD6D4y5p5vzrGuFDkry5QpznLSygAYAANgAAyAATAABsAAGAADYAAMgAEwAD8XADlChTQTIM0eIM0pIM3vAdL8JiLNawFpXo1I8zxAmicS0jwTkeapjDTvC8r0gQQK9UEESvUBBIr1qQTK9SkESvR/wQkQ5V95KhS+Q1AC14N34ZCYenD0LGNjoH7ij2ejQV71QPd2lNQapI8rut0d4LMe0Bz4CHMUSetZCGgPMESRYj1cAGARMIqv1kMlgK8pNQq39TARBB8VhCgyW59S414y6frjxDYeUYTCNnnKHw4WeUxl1/wtGjwk97LToyBan6irmRrPfSHj/K+ZuSJ3TImCav3zaqvlvTN57T9W6+ozJAqa9fH9/gLS3kja/wr69+PUKMhGXUxVie0mVVMXZAUSwONys4ztvHn5kQcgttubJ+tEkde7G2MEiExUyD3VVExE4AAPS40qTlaNSw8QgI+dnlxVx8ncnp0PCsD5WJnaI23Z2Lk3wP1igx83jA2L998V4G8E5WrVy0kRfIeXMLkMm1TIN8GWYXIQTVbKVa+cjLCO4r2+fFnq+X17MZ7N6GmlxRJXt1pWnjh3Q1yX09Vi8tXTl/zb8eeB5GCgkFe9cOAgTutPBcD1stbGEYXVtvYCaA4BwHU9W8smXzt7DesMBMB1NFQMVS8eOgK3hQM4zut6ezZdPbt9/ZWhKQsArpu5OrJ83dwNW0dGAFzHwyVe6iXDx8zt2AEc522jI8etntOx8cbRjAcA1+18/Vf5+vlbvk6cALhORkr/qZeOnHC34QdwnPfNTvzjLtC5+S7QRAQg8eNuYcEW6yAIIF4GQD8A9W5IZX3eFQW6tqI61KNbXf9vy4K/T/2Wd90X+hqFnfHG1K8oUq1nuqpVZD3zjal865nvjBVY74pC/qpg/nYkNQqb6+uZrChYrFcQhcBnOwlR2KIfLoUGlIj1EgaUsPVCUcixnjcKmdZzRCHdeqYo1FgPjUKl9YAolFtPjMIf672i8NP6DFH4br2pH1d/AAm28mJJn9pPAAAAAElFTkSuQmCC";
  img.style.cssText = "height: 35px;	width: 25px;";

  let button = document.createElement("button");
  button.className = "icon_pc";
  button.style.cssText = `position: fixed;
                          top: 15%;
                          right: 5%;
                          z-index: 99;
                          border-style: none;
                          text-align:center;
                          vertical-align:baseline;
                          background-color: #fafafa;
                          border-radius: 50%;`;
  button.onclick = exportBookshelf;
  button.appendChild(img);

  document.body.appendChild(button);
}
