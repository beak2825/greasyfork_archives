// ==UserScript==
// @name           WoD 英雄激活分组切换
// @icon           http://info.world-of-dungeons.org/wod/css/WOD.gif
// @namespace      WOD_Tools
// @description    英雄激活分组切换，初次使用时需要在我的英雄页面创建分组
// @author         Christophero
// @include        http*://*.world-of-dungeons.org*
// @license        MIT License
// @require        https://code.jquery.com/jquery-3.3.1.min.js
// @modifier       Christophero
// @version        2023.06.25.1
// @downloadURL https://update.greasyfork.org/scripts/520638/WoD%20%E8%8B%B1%E9%9B%84%E6%BF%80%E6%B4%BB%E5%88%86%E7%BB%84%E5%88%87%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/520638/WoD%20%E8%8B%B1%E9%9B%84%E6%BF%80%E6%B4%BB%E5%88%86%E7%BB%84%E5%88%87%E6%8D%A2.meta.js
// ==/UserScript==

(function () {
  ("use strict");
  const $heroH1 = $('form>h1:contains("我的英雄")');
  const isHeroes = $heroH1.length;
  const targetElement = $("td.gadget_table_cell.merged");
  if (!targetElement.length) {
    console.error(`找不到合适位置放置英雄分组组件`, targetElement);
    return;
  }
  const HERO_GROUP_DROPDOWN_ID = "heroGroupSelect";
  const CHANGE_HERO_GROUP_DROPDOWN_ID = "changeHeroGroupSelect";
  const HERO_GROUP_KEY = "HERO_GROUP";
  const NEW_GROUP_TAG = "(新建分组)";
  // 加载英雄分组
  const loadHeroGroup = () => {
    const heroGroupJson = localStorage.getItem(HERO_GROUP_KEY);
    let heroGroupMap = {};
    if (heroGroupJson) {
      heroGroupMap = JSON.parse(heroGroupJson);
    }
    return heroGroupMap;
  };

  const saveHeroGroup = (heroGroupMap) => {
    delete heroGroupMap[NEW_GROUP_TAG];
    localStorage.setItem(HERO_GROUP_KEY, JSON.stringify(heroGroupMap));
  };
  let heroGroupMap = loadHeroGroup();
  if (isHeroes) {
    const $funDiv = $("<div></div>");
    const $select = $(`<select id="${HERO_GROUP_DROPDOWN_ID}"></select>`);
    $select.append(`<option value="">${NEW_GROUP_TAG}</option>`);
    for (const key of Object.keys(heroGroupMap)) {
      $select.append(`<option value="${key}">${key}</option>`);
    }
    const $saveBtn = $(
      '<button class="button" type="button" title="保存分组">保存分组</button>'
    );
    const $delBtn = $(
      '<button class="button" type="button" title="删除分组">删除分组</button>'
    );
    $funDiv.append($select).append($saveBtn).append($delBtn);
    $heroH1.append($funDiv);

    $select.change(function () {
      let val = $(this).val();
      if (val) {
        const heroGroup = heroGroupMap[val];
        $('input[name^="aktiv"],input[name^="mentor_aktiv"]').prop(
          "checked",
          false
        );
        for (let hero of heroGroup) {
          if (hero.mentor) {
            $(`input[name='mentor_aktiv[${hero.id}]']:checkbox`).prop(
              "checked",
              true
            );
          } else {
            $(`input[name='aktiv[${hero.id}]']:checkbox`).prop("checked", true);
          }
        }
      }
    });

    $saveBtn.click(() => {
      let currentGroup = [];
      // 获得选中的英雄
      $heroH1
        .siblings("table:first")
        .find('input[name^="aktiv"]:checked')
        .each((i, e) => {
          const $row = $(e).parents("tr:first");
          let heroName = $row.find("td:first a").text();
          let heroId = $row.find('td:first input[type="radio"]').val();
          currentGroup.push({ id: heroId, name: heroName });
        });
      // 获得激活的导师
      $heroH1
        .siblings("table:first")
        .find('input[name^="mentor_aktiv"]:checked')
        .each((i, e) => {
          const $row = $(e).parents("tr:first");
          let heroName = $row.find("td:first a").text();
          let heroId = $row.find('td:first input[type="radio"]').val();
          currentGroup.push({ id: heroId, name: heroName, mentor: true });
        });
      console.log(currentGroup);
      // 如果是新建分组，则新建一个分组并保存，否则更新
      let val = $select.val();
      if (val == "") {
        let newHeroGroupName = prompt("请输入新的英雄分组名称:");
        if (!newHeroGroupName) {
          alert("已取消");
          return;
        }
        $select.append(
          `<option value="${newHeroGroupName}">${newHeroGroupName}</option>`
        );
        $select.val(newHeroGroupName);
        heroGroupMap[newHeroGroupName] = currentGroup;
      } else {
        heroGroupMap[val] = currentGroup;
      }
      saveHeroGroup(heroGroupMap);
      alert("保存成功");
    });

    $delBtn.click(() => {
      let val = $select.val();
      if (val) {
        const $selectedOption = $select.find("option:selected");
        const selectedHeroGroup = $selectedOption.text();
        if (confirm(`是否删除分组[${selectedHeroGroup}]`) == true) {
          delete heroGroupMap[val];
          saveHeroGroup(heroGroupMap);
          $select.val("");
          $selectedOption.remove();
          alert("删除成功");
        }
      } else {
        alert("请选择一条真实分组进行删除");
      }
    });
  }

  const formData2Json = function (formData) {
    const objData = {};
    //(value, key) => objData[key] = value
    formData.forEach((curValue, key) => {
      objData[key] = curValue;
    });
    return objData;
  };
  const $switchHeroSelect = $(
    `<select id="${CHANGE_HERO_GROUP_DROPDOWN_ID}"></select>`
  );
  $switchHeroSelect.append(`<option value="">选择切换英雄分组</option>`);
  for (const key of Object.keys(heroGroupMap)) {
    $switchHeroSelect.append(`<option value="${key}">${key}</option>`);
  }
  $switchHeroSelect.change(function () {
    let val = $(this).val();
    if (val) {
      if (confirm(`是否切换到分组[${val}]`) == true) {
        const heroGroup = heroGroupMap[val];
        //括号里面必须是DOM对象
        let data = new FormData($('[name="the_form"]')[0]);
        // hero页面必须先排除已选择的和FIGUR
        const deleteKeyArr = [];
        for (let key of data.keys()) {
          if (
            key == "FIGUR" ||
            key.startsWith("aktiv[") ||
            key.startsWith("mentor_aktiv[")
          ) {
            deleteKeyArr.push(key);
          }
        }
        for (let key of deleteKeyArr) {
          data.delete(key);
        }
        const session_hero_id = data.get("session_hero_id");
        let figur = session_hero_id;
        if (
          heroGroup.length &&
          !heroGroup.filter((hero) => hero.id == session_hero_id).length
        ) {
          figur = heroGroup[0].id;
        }
        for (let hero of heroGroup) {
          if (hero.mentor) {
            data.append(`mentor_aktiv[${hero.id}]`, "1");
          } else {
            data.append(`aktiv[${hero.id}]`, "1");
          }
        }
        data.append("FIGUR", figur);
        data.append("ok", "  OK  ");
        const url = "/wod/spiel/settings/heroes.php?session_hero_id=" + figur;

        const $form = $("<form />", {
          action: url,
          method: "post",
          style: "display:none;",
        }).appendTo("body");
        for (let entry of data.entries()) {
          console.log(entry);
          $form.append(
            `<input type="hidden" name="${entry[0]}" value="${entry[1]}" />`
          );
        }
        $form.submit();
        setTimeout(() => {
          location.reload();
        }, 1000);
      }
    }
  });
  targetElement.prepend($switchHeroSelect);
})();
