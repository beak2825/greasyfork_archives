// ==UserScript==
// @name             复制 qBittorrent 种子列表
// @name:en          qBittorrent webUI torrent list copy
// @namespace        localhost
// @version          0.2.1
// @description      在webUI的右键菜单中增加批量复制字段的功能，可直接粘贴到excel
// @description:en   add a contextmenu item to batch copy torrent information in order to pasting to Excel
// @author           flashlab
// @match            http://127.0.0.1:8080/
// @icon             https://www.qbittorrent.org/favicon.ico
// @license          MIT
// @run-at           document-end
// @downloadURL https://update.greasyfork.org/scripts/478932/%E5%A4%8D%E5%88%B6%20qBittorrent%20%E7%A7%8D%E5%AD%90%E5%88%97%E8%A1%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/478932/%E5%A4%8D%E5%88%B6%20qBittorrent%20%E7%A7%8D%E5%AD%90%E5%88%97%E8%A1%A8.meta.js
// ==/UserScript==

// 完整字段请参考官方api https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-4.1)#get-torrent-list
// 直接在 newItem 结尾增加<li>标签即可，href 的值为'#<字段名>'
// 仅在最新版qBitorrent中测试！

(function() {
    'use strict';
    var newItem = '<li class="separator">' +
    '  <a class="arrow-right" href="#">' +
    '    <img alt="Copy" src="images/edit-copy.svg"> 批量复制' +
    '  </a>' +
    '  <ul class="scrollableMenu" id="multicp">' +
    '    <li>' +
    '      <a id="copyswitch" href="#copyswitch" role="button">' +
    '        <img alt="Copy switch" src="images/checked-completed.svg"> 全选/取消' +
    '      </a>' +
    '    </li>' +
    '    <li>' +
    '      <a id="copyall" href="#copy" role="button">' +
    '        <img alt="Copy All" src="images/edit-copy.svg"> 复制字段' +
    '      </a>' +
    '    </li>' +
    '    <li class="separator">' +
    '      <a href="#hash">' +
    '        <input checked type="checkbox">Hash' +
    '      </a>' +
    '    </li>' +
    '    <li>' +
    '      <a href="#name">' +
    '        <input checked type="checkbox">名称' +
    '      </a>' +
    '    </li>' +
    '    <li>' +
    '      <a href="#added_on">' +
    '        <input type="checkbox">添加时间' +
    '      </a>' +
    '    </li>' +
    '    <li>' +
    '      <a href="#completion_on">' +
    '        <input type="checkbox">完成时间' +
    '      </a>' +
    '    </li>' +
    '    <li>' +
    '      <a href="#category">' +
    '        <input type="checkbox">分类' +
    '      </a>' +
    '    </li>' +
    '    <li>' +
    '      <a href="#content_path">' +
    '        <input type="checkbox">文件路径' +
    '      </a>' +
    '    </li>' +
    '    <li>' +
    '      <a href="#save_path">' +
    '        <input type="checkbox">保存路径' +
    '      </a>' +
    '    </li>' +
    '    <li>' +
    '      <a href="#size">' +
    '        <input type="checkbox">大小' +
    '      </a>' +
    '    </li>' +
    '    <li>' +
    '      <a href="#total_size">' +
    '        <input type="checkbox">总大小' +
    '      </a>' +
    '    </li>' +
    '    <li>' +
    '      <a href="#state">' +
    '        <input type="checkbox">状态' +
    '      </a>' +
    '    </li>' +
    '    <li>' +
    '      <a href="#progress">' +
    '        <input type="checkbox">进度' +
    '      </a>' +
    '    </li>' +
    '    <li>' +
    '      <a href="#tags">' +
    '        <input type="checkbox">标签' +
    '      </a>' +
    '    </li>' +
    '    <li>' +
    '      <a href="#tracker">' +
    '        <input type="checkbox">tracker域' +
    '      </a>' +
    '    </li>' +
    '    <li>' +
    '      <a href="#uploaded">' +
    '        <input type="checkbox">上传量' +
    '      </a>' +
    '    </li>' +
    '    <li>' +
    '      <a href="#magnet_uri">' +
    '        <input type="checkbox">磁力链接' +
    '      </a>' +
    '    </li>' +
    '  </ul>' +
    '</li>';

    function getDomainBody(string) {
      const match = string.match(/:\/\/([^\/]+\.)?([^\/\.]+)\.[^\/\.:]+/i)
      if (match != null && match.length > 2 && typeof match[2] === 'string' && match[2].length > 0) {
        return match[2]
      } else {
        return ''
      }
    }

    window.addEventListener('load', function () {
        const newmenu = document.getElementById('torrentsTableMenu');
        if (newmenu == null) return;
        //patch icon
        if (newmenu.querySelector('img').src.split("/").includes("icons")) {
            newItem = newItem.replaceAll("images/", "icons/").replace("checked-completed.svg", "checked.svg");
        }
        // append html
        newmenu.insertAdjacentHTML("beforeend", newItem)
        new ClipboardJS('#copyall', {
            text: function() {
                return copyAllSelected();
            }
        });
        // listen to option event
        const options = document.querySelectorAll("#multicp a:not([role])");
        options.forEach(function(op) {
            op.addEventListener("click", function(e) {
                e.stopPropagation();
                e.target.firstElementChild.checked ^= 1;
            });
        });
        const optionT = document.getElementById('copyswitch');
        optionT.addEventListener("click", function(e) {
            e.stopPropagation();
            const isChecked = optionT.classList.toggle("checkall")
            options.forEach(function(op) {
                op.firstElementChild.checked = isChecked;
            });
        });
        // ctrl + v event
        const tableArea = document.getElementById("transferList_pad");
        if (tableArea) window.addEventListener("keydown",function(e) {
            if (e.repeat) return;
            if ( e.keyCode == 67 && e.ctrlKey ) {
                document.getElementById("copyall").click()
            }
        }, false);
        // copy steps
        function copyAllSelected() {
            const tablekeys = [];
            const tablehead = [];
            options.forEach(function(op) {
                const key = op.href.split('#')[1];
                if (op.firstElementChild.checked && key) {
                    tablekeys.push(key)
                    tablehead.push(op.textContent.trim())
                }
            });
            if (tablekeys.length == 0) return alert("至少选择一个字段！")
            const selectedRows = torrentsTable.selectedRowsIds();
            if (selectedRows.length <= 0) return alert("至少选中一行！");
            let tablebody = "";
            const rows = torrentsTable.getFilteredAndSortedRows();
            selectedRows.forEach(function(hash) {
                const fulldata = rows[hash].full_data;
                const tablerow = [];
                tablekeys.forEach(function(k) {
                    switch (k) {
                        //github.com/qbittorrent/qBittorrent/blob/5db2c2c2be422bffca693f7d5620ee74970acd71/src/webui/www/private/scripts/dynamicTable.js#L1230
                        case "added_on":
                        case "completion_on":
                            tablerow.push(fulldata[k] <0 ? '' : new Date(fulldata[k] * 1000).toLocaleString());
                            break;
                        //github.com/qbittorrent/qBittorrent/blob/5db2c2c2be422bffca693f7d5620ee74970acd71/src/webui/www/private/scripts/misc.js#L56
                        case "size":
                        case "total_size":
                        case "uploaded":
                            tablerow.push(unsafeWindow.qBittorrent.Misc.friendlyUnit(fulldata[k]));
                            break;
                        case "tracker":
                            tablerow.push(getDomainBody(fulldata[k]));
                            break;
                        case "progress":
                            tablerow.push(unsafeWindow.qBittorrent.Misc.friendlyPercentage(fulldata[k]));
                            break;
                        default:
                            tablerow.push(fulldata[k]);
                    }
                });
                tablebody += tablerow.join("\t") + "\n";
            });
            alert("已复制到剪切板，请去excel粘贴")
            return tablehead.join("\t") + "\n" + tablebody;
        };
    }, false);
})();