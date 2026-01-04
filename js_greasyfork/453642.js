// ==UserScript==
// @name         碧蓝航线舰队科技
// @version      1
// @namespace    https://fiammanda.github.io
// @description  碧蓝航线 WIKI 舰队科技功能增强（样式修改、全选选中、数据备份）
// @author       fiammanda
// @grant        none
// @match        https://wiki.biligame.com/blhx/%E8%88%B0%E9%98%9F%E7%A7%91%E6%8A%80
// @icon         https://azurlane.netojuu.com/images/thumb/a/a6/Wisdom_Cube.png/35px-Wisdom_Cube.png
// @downloadURL https://update.greasyfork.org/scripts/453642/%E7%A2%A7%E8%93%9D%E8%88%AA%E7%BA%BF%E8%88%B0%E9%98%9F%E7%A7%91%E6%8A%80.user.js
// @updateURL https://update.greasyfork.org/scripts/453642/%E7%A2%A7%E8%93%9D%E8%88%AA%E7%BA%BF%E8%88%B0%E9%98%9F%E7%A7%91%E6%8A%80.meta.js
// ==/UserScript==

"use strict";

const bt = document.querySelector("#editButton");
const tb = document.querySelector("#CardSelectTr");
const ft = document.querySelector(".resourceLoader + .wikitable tbody");

bt.addEventListener("click", (e) => {
  if (bt.classList.contains("selected")) {
    tb.classList.remove("editable");
    ft.classList.remove("visible");
  } else {
    tb.classList.add("editable");
    ft.classList.add("visible");
  }
});

tb.querySelectorAll("tbody a").forEach(a => {
  a.innerHTML = a.innerHTML.replace("(", "[").replace(")", "]");
  a.target = "_blank";
});

document.querySelector("#CardSelectTabHeader1 th:nth-child(3)").textContent = "满级";
document.querySelector("#CardSelectTabHeader1 th:nth-child(5)").textContent = "获得";
document.querySelector("#CardSelectTabHeader1 th:nth-child(6)").textContent = "满级";

ft.querySelector("tr:last-child th").textContent = "功能";
ft.insertAdjacentHTML("beforeend", `
	<tr id="controls">
		<th>脚本</th>
		<td>
			<span class="btn"></span>
      <a class="btn btn-default" aria-label="select-all-get">全选「获得」</a>
      <a class="btn btn-default" aria-label="select-none-get">全清「获得」</a>
      <a class="btn btn-default" aria-label="select-all-120">全选「120」</a>
      <a class="btn btn-default" aria-label="select-none-120">全清「120」</a>
      <a class="btn btn-default" aria-label="data">数据备份</a>
      <div class="modal-content">
        <div class="modal-body">
          <h3>个人数据备份-复制</h3>
          <textarea placeholder="　"></textarea>
          <a class="btn btn-default" aria-label="data-import">导入数据内容</a>
          <a class="btn btn-default" aria-label="data-export">复制数据内容</a>
          <h3>个人数据备份-文件</h3>
          <label>
            <input type="file">
            <a class="btn btn-default" aria-label="data-upload">上传数据文件</a>
          </label>
          <a class="btn btn-default" aria-label="data-download">下载数据文件</a>
        </div>
        <div class="modal-footer">
          <a class="btn btn-default" aria-label="data-close">关闭</a>
        </div>
      </div>
    </td>
	</tr>
`);

ft.querySelector("a[aria-label=\"select-all-get\"]").addEventListener("click", (e) => {
  if (confirm("是否全选当前舰船的「获得」状态？")) {
    tb.querySelectorAll("tbody tr:not([style=\"display: none;\"]) td:nth-last-child(2):not(.fleetTechSelected)").forEach(cell => {
      cell.click();
    });
  }
});
ft.querySelector("a[aria-label=\"select-none-get\"]").addEventListener("click", (e) => {
  if (confirm("是否全清当前舰船的「获得」状态？")) {
    tb.querySelectorAll("tbody tr:not([style=\"display: none;\"]) td:nth-last-child(2).fleetTechSelected").forEach(cell => {
      cell.click();
    });
  }
});
ft.querySelector("a[aria-label=\"select-all-120\"]").addEventListener("click", (e) => {
  if (confirm("是否全选当前舰船的「120」状态？")) {
    tb.querySelectorAll("tbody tr:not([style=\"display: none;\"]) td:nth-last-child(1):not(.fleetTechSelected)").forEach(cell => {
      cell.click();
    });
  }
});
ft.querySelector("a[aria-label=\"select-none-120\"]").addEventListener("click", (e) => {
  if (confirm("是否全清当前舰船的「120」状态？")) {
    tb.querySelectorAll("tbody tr:not([style=\"display: none;\"]) td:nth-last-child(1).fleetTechSelected").forEach(cell => {
      cell.click();
    });
  }
});
ft.querySelector("a[aria-label=\"data\"]").addEventListener("click", () => {
  ft.querySelector(".modal-content").setAttribute("aria-hidden", "false");
});
ft.querySelector("a[aria-label=\"data-close\"]").addEventListener("click", (e) => {
  ft.querySelector(".modal-content").setAttribute("aria-hidden", "true");
});
ft.querySelector("a[aria-label=\"data-import\"]").addEventListener("click", () => {
  if (ft.querySelector("textarea").value && confirm("是否覆盖当前数据？")) {
    localStorage["userjs-fleettech-data"] = ft.querySelector("textarea").value;
  } else {
    alert("没有找到导入内容？！");
  }
});
ft.querySelector("a[aria-label=\"data-export\"]").addEventListener("click", () => {
  if (localStorage["userjs-fleettech-data"] && confirm("是否复制科技数据？")) {
      navigator.clipboard.writeText(localStorage["userjs-fleettech-data"]);
  } else {
    alert("你又没啥需要导出的！");
  }
});
ft.querySelector("a[aria-label=\"data-download\"]").addEventListener("click", () => {
  if (localStorage["userjs-fleettech-data"]) {
    if (confirm("是否下载科技数据？") == true) {
      let link = document.createElement("a");
      link.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(localStorage["userjs-fleettech-data"]));
      link.setAttribute("download", "碧蓝航线舰队科技." + new Date().toLocaleString("sv-SE").replace(/[-: ]/g, "") + ".txt");
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  } else {
    alert("你又没啥需要导出的！");
  }
});
ft.querySelector("input").addEventListener("change", () => {
  const [file] = ft.querySelector("input").files;
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    localStorage["userjs-fleettech-data"] = reader.result;
    alert("数据导入成功，即将刷新。");
    setTimeout(() => { location.replace("/blhx/舰队科技#舰队科技列表") }, 2500);
  }, false);
  if (file && confirm("是否覆盖当前数据？")) {
    reader.readAsText(file);
  }
});

document.head.insertAdjacentHTML("beforeend", `<style>
  @media (min-width: 768px) {
    #CardSelectTr tr {
      font-size: 13px;
      line-height: 1.5;
    }
	}

	#controls td {
    pointer-events: none;
	}
	#controls td a {
    opacity: 0;
		transition: .2s ease-in-out;
	}
	#controls td span {
		position: absolute;
    pointer-events: none;
		transition: .2s ease-in-out;
	}
	#controls td span::before {
		content: "请先打开编辑模式";
	}
  .visible #controls td {
    pointer-events: all;
  }
  .visible #controls td a {
    opacity: 1;
    pointer-events: all;
  }
  .visible #controls td span {
    opacity: 0;
  }
	#controls h3 {
		margin: 1em 0 .5em;
	}
	#controls input {
		display: none;
	}
	#controls textarea {
		margin: 0 0 .5em;
		padding: .5em;
		width: 100%;
		height: 150px;
		resize: none;
		overflow: hidden scroll;
	}
	#controls .modal-content {
		position: fixed;
		top: calc(50% - 215px);
		left: calc(50% - 300px);
		width: 600px;
		height: 425px;
    opacity: 0;
    pointer-events: none;
		transition: .2s ease-in-out;
	}
	#controls .modal-content[aria-hidden="false"] {
    opacity: 1;
    pointer-events: all;
	}
	#controls .modal-body {
		margin: 0 0 1em;
		padding: .5em 1em 1em;
	}
	#controls .modal-footer {
		padding: .5em 1em;
	}
	#CardSelectTr a, .btn {
		transition: .2s ease-in-out;
	}
  #CardSelectTr a:hover, #CardSelectTr a:focus {
    text-decoration: none !important;
		opacity: .5;
  }
  #CardSelectTr tr {
    font-size: 14px;
    line-height: 2;
  }
  #CardSelectTr tbody tr {
    border-bottom: 1px solid #0003;
  }
  #CardSelectTr th {
		padding: 0 1.5em 0 .5em;
		font-weight: normal;
		text-align: right;
  }
  #CardSelectTr th[colspan] {
		text-align: center;
  }
  #CardSelectTr td {
		padding: 0 .5em;
		text-align: right;
  }
  #CardSelectTr tr:nth-of-type(2n+1) {
    background-color: #fff;
  }
  #CardSelectTr th[rowspan]:nth-child(2), #CardSelectTr th[rowspan]:nth-child(3), #CardSelectTr th[rowspan]:nth-child(4),
  #CardSelectTr td:nth-child(2), #CardSelectTr td:nth-child(3), #CardSelectTr td:nth-child(4) {
		text-align: left;
  }
  #CardSelectTr td:nth-last-child(1), #CardSelectTr td:nth-last-child(2) {
		opacity: .5;
		transition: .2s ease-in-out;
  }
  #CardSelectTr td:nth-last-child(1)::after, #CardSelectTr td:nth-last-child(2)::after {
		content: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23fff'%3E%3Cpath d='M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z'/%3E%3C/svg%3E");
		display: inline-block;
    height: 1em;
    width: 1em;
		background: #ddd;
		border-radius: 1px;
		transform: translate(2px, 2px);
		transition: .2s ease-in-out;
		color: transparent;
	}
  #CardSelectTr .fleetTechSelected {
		opacity: 1 !important;
    background: #fff0 !important;
  }
  #CardSelectTr td.fleetTechSelected::after {
    background: #58b4f5;
	}
  #CardSelectTr.editable td:nth-last-child(1), .editable td:nth-last-child(2) {
    cursor: pointer;
  }
  #CardSelectTr.editable td:nth-last-child(1):hover::after, #CardSelectTr.editable td:nth-last-child(2):hover::after {
    background: #58b4f5;
  }
  #CardSelectTr.editable td.fleetTechSelected:hover::after {
    background: #b6e0ff;
  }
	table.wikitable.FilterTable th {
		padding: 2px;
		font-weight: normal;
	}
	table.wikitable.FilterTable td {
		padding: 2px;
	}
	.resourceLoader + .wikitable .btn {
		padding: 4px 8px;
	}
</style>`);

