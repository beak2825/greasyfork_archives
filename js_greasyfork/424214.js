// ==UserScript==
// @name         dev_Top_Menu_Links2
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  User defined links in top menu
// @author       Dediggefedde
// @match        *://*.deviantart.com/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @grant        GM.setValue
// @grant        GM.getValue
// @grant        GM.addStyle
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/424214/dev_Top_Menu_Links2.user.js
// @updateURL https://update.greasyfork.org/scripts/424214/dev_Top_Menu_Links2.meta.js
// ==/UserScript==
/* globals $*/

/*
settings: new page "custom links"
options:
    image, (default none) TODO: find new list of icons / UTF8 icon list
    Text
    URL, TODO: suggestions for common targets
special: sortable by drag/drop, use jquery UI?
Also: think about design issures (long menu!, new menu?, drop-menu?, collapsible?)
*/

/*
role= is the new structure definind feature of eclipse. calss names changes on navigation, ids come sparse
header[role=banner] is top menu
div[role='dialog'] is user dropdown-menu
div[role='listbox'] is the list of entries in the dropdown-menu
div[role='group'] is group of links (only found in user dropdown so far
There is span[role=option], but only used once at top (not for each option)
Within options, I use tags since no further roles/hooks are used.

for information data- attributes can be used (data-hook for identifying elements)
*/


(function () {
	"use strict";
	// var iconlink = "https://st.deviantart.net/minish/gruzecontrol/icons-gruser.gif?37";
	var plusimg = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAR2wAAEdsBLB24oQAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAIESURBVDiNnZS%2Fa1RBEMc%2FM7Pv0MhB8ET8QQpBaysLwUqwVcHCVDaCja2NtamtVOxFiGBjae8fYJUmhWJzFokSosbc252xePcu7%2FQumNtul5nPfOfHjkQEs871x%2F3np08u3Upm3r6pCNmLbn%2Ffe%2Fd%2BbefhLL80kwZUYoMHq5fP90%2F08AjCwSPY2d3nxeuPg3l%2Bc4FikHNQZ8c9xtAgZyeZznM7RGFS6lKoa8WDCTRnx0yODjSTfxS6Q12cahGFKRk5F0a1EhFTCqvDFN5eG7w0tVMCqAkCiEJxv%2BIe1LmMYRAeFA8cuXr%2F2cpbBAxAFWlibMm9p2eHN29cPOMBtEoAAXqVddKNsVL4PcqUEo19tMFg8%2FO3ryn1rPQqmxqNFjKqC9FpSAsVBFVwbwJLBCGQzEpKKn8VPmZCvBPsoKaNXYxt1YSkKtR1mRqN%2F4K09059TcfAUfZJlHmQ6ASbvE3dxwpFxHZ%2FjPAIiAYWEQRCUpmqqXsDyd3f04IDTMVSLr6%2Bsbk10Lb1Cori7tdWzvUvCNPQUoJfP%2BtPanwQbRxUQQUQ2ZZ52%2BbRq0vrg%2BVjd5E2XSbpFXjz5M7G6pF%2BSlUpuXjT8fFiaCegVy3y9UQ6tTqAEnB8qVoAWCn7dcHL9LiIsNhyMFPyXm7S7o6G6GLrq1IdLvd7XwgcAREQFDU0mQ3n%2Bf0Bhyn%2B7DYGIGsAAAAASUVORK5CYII%3D";
	var delimg = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAS3gAAEt4BMgl5kwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAANsSURBVDiNfVTfbxRVFP7Onbnzc4e2Cws1qDEQY9S2u9WY2CglLSD0AUwI4cVITDRGkfoPoKENEn3RB2OoT7744D9gFB4Q6cbEF8JS%2F4ZqqaE%2FoN2lc38cH3ZmmZ0QT3Izufd8891zvvPNgJlRXEcrwdzxOFh8FYjKuXydBKL3wsriB0FlrpwTKMRbSTj%2FWurNnntUmdgfBTdOEUUoxSmiaE8Y%2F1bX3sSwdS5cCJP5Yp6YGQAwE4eXx7V%2F%2FqgKq5oYy8LoX7327c12%2B8h15m0AOEcUyzC%2BOaq98YiFq8H4R5j724IXvulsft4jPJGEX7yS%2Bh9Pq7BqiKEBGDBWhNFN2bmz02lPA8BAGN98SXuNkIWb4zQYm2TXlMDCl52Nz2imElxppP5HUzqo5gADQFP3%2BS8Z05I7LYLAi9ptBEyOoX6cBpCC1wTwvSstHXvBysE0q0oXwWBUIJwx7TcMAA9wFD0ZZwmDkumY89Sg%2Fulvi5madfZ5IMqrVNS9XQEgQIAgFLrVqEK7igBLbEMWLZPKKWJmnCWq%2BGF0a0KFjYRJ5C1pAEVNy1UZAhhsYxYtlcrDl3h1qzfls0SVJIwXR7VXj1iInMBkxLmmunAOwCYs7g6kcvI8r2712aZLureyJ%2Bw0Dxg5JpmEKVWZV6UzsgErlgaUPJSTAYBbNGUNgGt7t%2FdVZUrtChBcUNn3j7%2BU96mWSL%2FTHGZ3jJiEygaSZsKnyPbU3W%2BTFctCj2lpmj9QLen7Uj6l3buEr5o1dkZcQJTbK2tXlCFisnXjLcUKh9%2Fh%2Bw9oFtVdrq%2BaVXZGnIzsfwfyhMknTPYNFf61T9tJ55Av%2FxxiZ5Tyyoh7PlPZC06Xjx8JFpqy84IfH5KlFWH2PgP%2FhHCJftkBbypwV5%2BSVg7DPG3dpYPWWwpZGJVp2tM4wx007oZrcU181dm4KASuWmBdgZEiBzNchn7Wypav3ElHickR491NWOgujnu415W%2F9rIOFs6Y1Ys9H17xhy6n4E%2FWhR3SYARM%2Bjkr7wwpOfUur2wDwI80HBvX3PrD7dSXHeNqMN5UwdqI9q6eNquPf195fO0PzW%2BBZ9eFTZ438rZUwfSHvNwu%2Buxn2h9tOer3a157%2FIBxH9S1%2F93b5t6lPtsU41u5e84hHJEqOF4mK5IqR19nxo3T5t5cMfcf2%2F8%2BXPr5xm0AAAAASUVORK5CYII%3D";
	var upimg = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAANXAAADVwB7ig%2B4wAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAIvSURBVDiNjdI9UxNBGAfw%2F7P3kuQuOiCEg6BWgryon8DGUVKKNn4EP4RN2MbWj8FYEBjrII2thY0TCxxHRQljgLwdl%2BR2H4vEmLc72Gbv5nZ%2F9%2Fx3H2JmxA0pSdQ95y0BlC77L%2FJ51nHrKQ6UkkTVcwoP7rsbzEDpy0XR%2Bdl4HodGglKSaMw7hfV77sbiou1oDRwdtfzDr0HR%2FhaNTgSlJNFccHbW1t1cNms7WjO0BrQGyuW2%2F%2BN7q0iH9YnoGCglCT%2Fr7KyuubmF%2BUHs%2F1w5Df3fx%2B19Xao9G0WHQClJXCymCyurqQ3Ps5xRaHCuniv%2FtBLutz6fD6F9UEoSwc307vLd5BPPG44ZhTYbyq%2FV1Xv%2F0%2FnmP5SYuYe5e0vLqcfe3OSYUXMQsB%2B09EHt49nTfJ41bW1BBLfcd3eWUo%2FmMvExo76FIXzWfODVTzfN9u307tQ1I0cM6%2BSkA2bAdQ0YRnxcpRgqZDAAZjgkkKtMzxTMtsKbs6rarjUUAMAQlJ3NmK8ys9ZMHNgJuUKM1xD8yzS7BRBwPN4229dXbkyZH6amrZm4swOjYhE9fJn7Uxrcb442pg0A1I0UBxqCeouHxxgIGyAAKhwEx1EjMdGbVKENkEao4lvGBgGJq1SY6GZWo6BiaEb%2FmQAkrhI5YQNgQIXxDQ3q%2F%2F2SCtFd27nkUrrHc4UKbQAd6l0K96JOQKPEMdBKclNogm2ZRyCACDAIgCBQ750ISCWNpEloju7%2FC7GBED0wwi%2FRAAAAAElFTkSuQmCC";
	var downimg = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAANOgAADToBAyIehQAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAJPSURBVDiNjdQ%2FTxRBGMfx7zOze3u3Bxycika00ljYKI0FURP%2FhMJCgYSC1tqKN3C5wk5Lw6sgZ4x2CDHR%2BKcx0TdgNBIkhzSyELmZx2JZWdi9wJNsdrPZ%2Bcxvn9kdUVXy9fBxfD6q6udGw%2B6IAQFEBAQkO4Ak8dXtRMefzSc%2F8uMDDpUaV79wseYmJhpj3iuq4D1k1%2BrBq%2FL1y9b66ndXPzy%2BAAIIgnNaCmVnEaBSHFsAs2d6vXLIe8i6VOKVJKwAAt6VQ1ni4yeM0qY7pzlwH0phBQzgjpFwr1KwCGVJxUAUHSNhVIkQgZ4rh7IJ%2BlV5QgHnyqH%2FryxQKevh%2FELthhUZw1osUAn0rBDiXLbK2avnJ1AMYLD3nnSaV7FgASw%2Fg3ocPBoYsNMnT4UhCgrEscW7csj79FOqxWY0COQpgKK4nu6qSMcE3%2F7M7Wz7l85p0hgOaAxZrIWeSxfmwNHbv6cK1qaLoypbgnm1%2BfH3nKgq7bYYc6mxOHo6nBwasnEhUdbDvU8oa4N6cKpbgix132%2FMtFrqJdsc2m0xlcuNxWYznIzrEh8FeVVQEpCl7oeN6VZLPYDkd5t2W0x8ZXhxcMBOViKJ%2B0HpUBIbyNL6u32sAGbo4Phwp1azd60lPgx5VYxIEobyeu3txlQeKwUzdOTayHNrzB1E4zxojSRhZJbXbncftDiIQfpDFqrVUr%2F5aXMKWFZPkq4sGCtJVDUr%2FbC%2BCfNJz1xvvvi7yy0UqnWzsnqze78fdiQI0EbMuTcnOiLC4K%2FuzOysFreYXP0DXyvXcr82O8gAAAAASUVORK5CYII%3D";
	var defaultSet = "[{'text':'Custom Link Settings','url': 'https://www.deviantart.com/settings/browsing#TopMenuLinks', 'icon':''},{'text':'Cute cats!','url': 'https://www.deviantart.com/search?q=cute%20cats', 'icon':''}]";


	var settingTemplateHead = `
		<span class="topmenu_header">Title</span>
		<span class="topmenu_header">URL</span>
		<span class="topmenu_header">Options</span>`;
	var settingTemplateEntry = `
		<input type="text" role="text" />
		<input type="text" role="url" />
		<span role="buttons">
			<a class="push" role="addLink" onclick="return false;">
				<img src="${plusimg}" alt="add link" title="Add Link" class="pop plus"/></a>
			<a class="push" role="delLink" onclick="return false;">
				<img src="${delimg}" alt="delete link" title="Delete Link" class="pop del"/></a>
			<a class="push" role="upLink" onclick="return false;">
				<img src="${upimg}" alt="move up" title="Move Up" class="pop up"/></a>
			<a class="push" role="downLink" onclick="return false;">
				<img src="${downimg}" alt="move down" title="Move Down" class="pop down"/></a>
		</span>`;

	var topLinks = []; //[{title, url, icon}]

	function fillGrid() {
		var gridSets = $("#daTopMenuLink2_gridset").empty();
		gridSets.append(settingTemplateHead);
		topLinks.forEach((el, ind) => {
			var entr = $(settingTemplateEntry);
			entr.closest("input[role='text']").val(el.text);
			entr.closest("input[role='url']").val(el.url);
			entr.closest("a[role='icon']").attr("imgID", el.icon).data("index", ind);
			entr.attr("index", ind);
			gridSets.append(entr);
		});
		appendHandlers();
	}
	function appendHandlers() {

		var gridSets = $("#daTopMenuLink2_gridset");
		gridSets.find("a[role=addLink]").click(function () {
			var imgind = parseInt($(this).closest("span[index]").attr("index"));
			topLinks.splice(imgind + 1, 0, {
				text: "",
				url: "",
				img: ""
			});
			GM.setValue("topLinks", JSON.stringify(topLinks));
			fillGrid();
		});

		gridSets.find("a[role=delLink]").click(function () {
			var imgind = parseInt($(this).closest("span[index]").attr("index"));
			topLinks.splice(imgind, 1);
			GM.setValue("topLinks", JSON.stringify(topLinks));
			fillGrid();
		});

		gridSets.find("a[role=upLink]").click(function () {
			var imgind = parseInt($(this).closest("span[index]").attr("index"));
			if (imgind === 0) {return;}
			var el = topLinks[imgind];
			topLinks[imgind] = topLinks[imgind - 1];
			topLinks[imgind - 1] = el;
			GM.setValue("topLinks", JSON.stringify(topLinks));
			fillGrid();
		});

		gridSets.find("a[role=downLink]").click(function () {
			var imgind = parseInt($(this).closest("span[index]").attr("index"));
			if (imgind >= topLinks.length - 1) {return;}
			var el = topLinks[imgind];
			topLinks[imgind] = topLinks[imgind + 1];
			topLinks[imgind + 1] = el;
			GM.setValue("topLinks", JSON.stringify(topLinks));
			fillGrid();
		});

		gridSets.find("input[role=text]").change(function () {
			var imgind = parseInt($(this).attr("index"));
			topLinks[imgind].text = $(this).val();
			GM.setValue("topLinks", JSON.stringify(topLinks));
		});
		gridSets.find("input[role=url]").change(function () {
			var imgind = parseInt($(this).attr("index"));
			topLinks[imgind].url = $(this).val();
			GM.setValue("topLinks", JSON.stringify(topLinks));
		});
	}

	function insertSettingsPage() {
        if(document.getElementById("daTopMenuLink2_gridset")!=null)return;

		addSettingCss();
		var section = $("div.fooview.ch");
		var custSection = section.first().clone().insertAfter(section.last()).find("div.fooview-inner");
		custSection.empty();
		//custSection.find("h3").html("Custom Links");
		//custSection.find("div.rr").remove();
		custSection.append("<h3>Custom Links</h3><span>Add links to display in your username-top-menu.</span><div id='dev_top_menu_links2_icondiag'></div>");
		var gridSets = $("<div id='daTopMenuLink2_gridset'></div>").appendTo(custSection);
		gridSets.css({
			"display": "grid",
			"grid-template-columns": "auto auto auto",
			"grid-gap": "5px",
			"margin": "10px 0"
		});
		fillGrid();
		if (location.href.indexOf("#TopMenuLinks") !== -1) {custSection[0].scrollIntoView();}
	}

	function addSettingCss() {
		GM.addStyle(`
			#daTopMenuLink2_gridset span.topmenu_header{text-align:center;font-weight:bold;}
			#daTopMenuLink2_gridset span[role=buttons]{text-align:center;}
			#daTopMenuLink2_gridset span[role=buttons] img{margin: 0 5px;}
			#daTopMenuLink2_gridset a[role=icon] img{width:100%;height:100%;}
			#daTopMenuLink2_gridset img.pop{cursor:pointer;}
			#daTopMenuLink2_gridset img.pop:active{transform: scale(0.8);}
		`);
	}

	function addElements() {

        if (location.href.indexOf("deviantart.com/settings/browsing") !== 0) {
            insertSettingsPage();
        }

        var container = $("div[role=menu]:not([dev_top_menu_links2])");
        if(container.length!=0){
            container.attr("dev_top_menu_links2",1);

            let entry=container.find("a").last();
            topLinks.forEach(el => {
                entry =entry.clone();
                entry.attr("href",el.url);
                entry.attr("title","Custom Link inserted by dev_top_menu_links2.");
                entry.addClass("dev_top_menu_links2_link");
                entry.html(el.text+"<span class='dev_tml2_marker'></span>");
                container.append(entry);
            });
        }
    }

    GM.getValue("topLinks", defaultSet).then(function (data) {
	    topLinks = JSON.parse(data);
        GM.addStyle(".dev_tml2_marker{display: inline-block;border-radius: 5px;width: 5px;height: 5px;background-color: green;margin-top: -0.9em;}}");
	    setInterval(addElements,1000);
    });
})();
