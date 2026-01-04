// ==UserScript==
// @name       Bangumi Mio Tools
// @namespace  remio/script-bangumi
// @version    1.0.0
// @author     kasuie
// @license    MIT
// @icon       https://www.google.com/s2/favicons?sz=64&domain=bgm.tv
// @match      https://bgm.tv/*
// @grant      GM.deleteValue
// @grant      GM.getValue
// @grant      GM.listValues
// @grant      GM.setValue
// @grant      GM.xmlHttpRequest
// @description Bangumi tools with mio
// @downloadURL https://update.greasyfork.org/scripts/500082/Bangumi%20Mio%20Tools.user.js
// @updateURL https://update.greasyfork.org/scripts/500082/Bangumi%20Mio%20Tools.meta.js
// ==/UserScript==

(function () {
  'use strict';

  var _GM = /* @__PURE__ */ (() => typeof GM != "undefined" ? GM : void 0)();
  const storage = {
    set(key, val) {
      return _GM.setValue(key, val);
    },
    get(key, defaultValue) {
      return _GM.getValue(key, defaultValue);
    },
    all() {
      return _GM.listValues();
    },
    del(key) {
      return _GM.deleteValue(key);
    },
    async clear() {
      let keys = this.all();
      for (let key of await keys) {
        _GM.deleteValue(key);
      }
    }
  };
  const request = (data) => {
    return new Promise((resolve, reject) => {
      if (!data.method) {
        data.method = "get";
      }
      if (!data.timeout) {
        data.timeout = 6e4;
      }
      data.onload = function(res) {
        try {
          resolve(JSON.parse(res.responseText));
        } catch (error) {
          reject(error);
        }
      };
      data.onerror = function(e) {
        reject(e);
      };
      data.ontimeout = function() {
        reject("timeout");
      };
      _GM.xmlHttpRequest(data);
    });
  };
  let $message, $button, global;
  const BaseUrl = "https://example.com";
  const onMessage = (text, type = "success", time = 3e3) => {
    if (text && $message) {
      let timer;
      if (timer) clearTimeout(timer);
      if (type == "success") {
        $message.css("color", "#4ef16a");
      } else if (type == "error") {
        $message.css("color", "#f23939");
      } else {
        $message.css("color", "#ffffff");
      }
      $message.text(text);
      $message.css("top", "36px");
      timer = setTimeout(() => {
        $message.css("top", "-36px");
        $message.text("");
      }, time);
    }
  };
  const onLoading = (loading = true) => {
    const $submit = $("#apisubmit");
    $button && $button.attr({
      disabled: loading
    });
    $submit && $submit.attr({
      disabled: loading
    });
  };
  const onGetPathEnd = (type, _path = null) => {
    const path = _path || window.location.pathname;
    if (path && path.includes(type)) {
      const pathname = path.split("/");
      if (pathname == null ? void 0 : pathname.length) {
        return _path ? pathname[pathname.length - 1] : +pathname[pathname.length - 1];
      } else {
        return null;
      }
    } else {
      return null;
    }
  };
  const init = () => {
    $button = $("<button>", {
      id: "mio-button",
      text: "Mio"
    });
    $message = $("<div>", {
      id: "mio-message"
    });
    const styles = `
      .modal {
          display: none; /* 默认隐藏 */
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 420px;
          background-color: #010101;
          box-shadow: 0 0 15px rgba(0, 0, 0, 0.5);
          padding: 20px;
          border-radius: 10px;
          z-index: 1000;
      }
      .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 18px;
          font-weight: bold;
      }
      .submit-btn {
        padding: 6px 16px;
        font-size: 12px;
        background-color: #f09199;
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
      }
      .close-btn {
          cursor: pointer;
          font-size: 24px;
      }
      .modal-body {
          margin: 20px 0;
          min-height: 200px;
      }
      .modal-footer {    
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 16px;
      }
      .overlay {
          display: none; /* 默认隐藏 */
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          z-index: 999;
      }
      .open-modal-btn {
          padding: 10px 20px;
          font-size: 16px;
          cursor: pointer;
      }
      #rank {
        outline: none;
        border: none;
        background-color: rgba(255, 255, 255, .3);
        width: 80px;
        border-radius: 8px;
        padding: 6px 8px;
      }
      #api {
        outline: none;
        border: none;
        background-color: rgba(255, 255, 255, .3);
        width: 180px;
        border-radius: 8px;
        padding: 6px 8px;
      }
      `;
    $("head").append(`<style>${styles}</style>`);
    $("body.bangumi").append(`
                <div class="overlay"></div>
                <div class="modal">
                    <div class="modal-header">
                        <span class="modal-title">添加</span>
                        <span class="close-btn">&times;</span>
                    </div>
                    <div class="modal-body">
                    </div>
                    <div class="modal-footer">
                        <input id="api" type="text" placeholder="提交接口" />
                        <input id="rank" type="number" placeholder="排名" />
                        <button id="apisubmit" class="submit-btn">提交</button>
                    </div>
                </div>
            `);
    $(".close-btn").on("click", onCloseModal);
    $(".submit-btn").on("click", function() {
      const rank = +($("#rank").val() || -1);
      const { params, url } = global;
      if (rank) {
        onAppend("div.modal-body", "<p>获取到排名信息...</p>");
      }
      onSubmit(url, {
        ...params,
        rank: rank ? rank : null
      });
    });
    $button.on("click", function() {
      onGetData();
      $(".overlay, .modal").fadeIn();
    });
    $button.css({
      padding: "6px 16px",
      "font-size": "12px",
      "background-color": "#f09199",
      color: "white",
      border: "none",
      "border-radius": "8px",
      cursor: "pointer",
      position: "fixed",
      top: "14px",
      right: "20px"
    });
    $message.css({
      position: "fixed",
      top: "-36px",
      left: "50%",
      transform: "translateX(-50%)",
      width: "200px",
      textAlign: "center",
      minWidth: "100px",
      minHeight: "36px",
      background: "rgba(0,0,0,.4)",
      borderRadius: "12px",
      transition: "all .3s ease-in-out",
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    });
    $("body.bangumi").append($button);
    $("body.bangumi").append($message);
  };
  const CID = onGetPathEnd("character");
  const SID = onGetPathEnd("subject");
  console.log("CID>>>", CID, "SID>>>", SID);
  const onAppend = (ele, data) => $(ele).append(data);
  const onClear = (ele) => $(ele).html("");
  const onCloseModal = () => {
    $("#rank").val("");
    onLoading(false);
    onClear("div.modal-body");
    $(".overlay, .modal").fadeOut();
  };
  const onGetData = async () => {
    const CharApi = await storage.get("CharApi", `${BaseUrl}/bgm/saveChar`);
    const SubApi = await storage.get("SubApi", `${BaseUrl}/bgm/saveSub`);
    console.log(CharApi, SubApi, "CharApi, SubApi");
    if (CID) {
      $("span.modal-title").text("新增角色");
      onLoading();
      onAppend("div.modal-body", "<p>开始加载数据...</p>");
      const character = request({
        method: "GET",
        url: `https://api.bgm.tv/v0/characters/${CID}`
      });
      request({
        method: "GET",
        url: `https://api.bgm.tv/v0/characters/${CID}/persons`
      }).then((cvs) => {
        let cv = null;
        const item = cvs == null ? void 0 : cvs.find((v) => v.subject_type === 2);
        if (item == null ? void 0 : item.id) {
          cv = request({
            method: "GET",
            url: `https://api.bgm.tv/v0/persons/${item.id}`
          });
        }
        Promise.all([character, cv]).then(([character2, cv2]) => {
          const cvData = cv2 && formatPerson(cv2, true);
          const params = {
            ...formatChar(character2),
            actors: cvData ? JSON.stringify({ name: cvData.name, id: cvData.id }) : null,
            cv: cvData
          };
          global = {
            params,
            url: CharApi
          };
          onLoading(false);
          onAppend("div.modal-body", "<p>加载成功</p>");
          $("#api").val((global == null ? void 0 : global.url) || "");
        });
      });
    } else if (SID) {
      $("span.modal-title").text("新增番剧");
      onLoading();
      onAppend("div.modal-body", "<p>开始加载数据...</p>");
      const subject = request({
        method: "GET",
        url: `https://api.bgm.tv/v0/subjects/${SID}`
      });
      const characters = request({
        method: "GET",
        url: `https://api.bgm.tv/v0/subjects/${SID}/characters`
      });
      const persons = request({
        method: "GET",
        url: `https://api.bgm.tv/v0/subjects/${SID}/persons`
      });
      Promise.all([subject, characters, persons]).then(
        ([subject2, characters2, persons2]) => {
          const afterPersons = formatRoles(persons2);
          const { data, actors } = formatRoles(characters2, true);
          const personsId = [], resultPersons = [];
          const relCharacters = data.map((v) => ({
            id: v.id,
            name: v.name,
            relation: v.relation
          }));
          const relPersons = afterPersons.map((v) => {
            if (!personsId.includes(v.id)) {
              personsId.push(v.id);
              resultPersons.push({
                ...v,
                summary: null
              });
            }
            return {
              id: v.id,
              name: v.name,
              position: v.summary
            };
          });
          const resultActors = (actors == null ? void 0 : actors.reduce(
            (prev, curr) => {
              if (!prev[0].includes(curr.id)) {
                prev[0].push(curr.id);
                prev[1].push(curr);
              }
              return prev;
            },
            [[], []]
          )[1]) || [];
          const params = {
            ...formatSub(subject2),
            characters: data,
            persons: resultPersons.concat(resultActors),
            relPersons: JSON.stringify(relPersons),
            relCharacters: JSON.stringify(relCharacters)
          };
          global = {
            params,
            url: SubApi
          };
          onLoading(false);
          onAppend("div.modal-body", "<p>加载成功</p>");
          $("#api").val((global == null ? void 0 : global.url) || "");
        }
      );
    }
  };
  const onSubmit = (url, params, options = {
    method: "POST"
  }) => {
    onAppend("div.modal-body", "<p>开始上报数据...</p>");
    const Api = $("#api").val();
    if (Api !== url) {
      if (CID) {
        storage.set("CharApi", Api);
      } else if (SID) {
        storage.set("SubApi", Api);
      }
    }
    console.log("onSubmit:", params);
    request({
      ...options,
      url,
      headers: { "Content-Type": "application/json" },
      data: JSON.stringify(params)
    }).then((res) => {
      console.log(res, "请求结果~");
      onAppend(
        "div.modal-body",
        `<p>上报数据结果:${res.success ? "成功" : "失败"}</p>`
      );
      onMessage(res.message, res.success ? "success" : "error");
    }).catch((e) => onMessage(`请求失败：${e}`, "error")).finally(
      () => setTimeout(() => {
        onCloseModal();
      }, 300)
    );
  };
  const formatPerson = (person, isCv) => {
    let {
      career,
      blood_type,
      birth_day,
      birth_mon,
      birth_year,
      images,
      infobox,
      gender,
      stat,
      last_modified,
      img,
      ...others
    } = person;
    for (const key in images) {
      images[key] = images[key].replace("https://lain.bgm.tv", "");
    }
    const infoKeys = [
      { name: "中文名", field: "nameCn" },
      { name: "别名", field: "aliasName" },
      { name: "性别", field: "gender" },
      { name: "生日", field: "birth" },
      { name: "Twitter", field: "twitter" },
      { name: "引用来源", field: "source" }
    ];
    let aliasName, nameCn, twiAccount, birthDay;
    const info = infobox == null ? void 0 : infobox.reduce((prev, curr) => {
      const item = infoKeys.find((v) => curr.key.includes(v.name));
      if (item) {
        if (item.field === "nameCn" && !nameCn) {
          nameCn = curr.value;
        } else if (item.field === "aliasName" && !aliasName) {
          aliasName = curr.value;
        } else if (item.field === "gender" && !gender) {
          gender = curr.value === "男" ? "male" : "female";
        } else if (item.field === "twitter") {
          if (curr.value.includes(".com")) {
            twiAccount = onGetPathEnd(".com", curr.value);
          } else {
            twiAccount = curr.value;
          }
        } else if (item.field === "birth") {
          birthDay = curr.value;
        }
      } else {
        !prev && (prev = {});
        prev[curr.key] = curr.value;
      }
      return prev;
    }, null);
    if (!birthDay) {
      birthDay = [birth_year, birth_mon, birth_day].reduce((prev, curr) => {
        return prev ? `${prev}-${curr || ""}` : curr;
      }, null);
    }
    return {
      ...others,
      twiAccount,
      birthDay,
      nameCn,
      gender,
      isCv,
      info: JSON.stringify(info),
      aliasName: aliasName && JSON.stringify(aliasName),
      bgmImages: JSON.stringify(images),
      career: career && career.join(",")
    };
  };
  const formatChar = (char) => {
    let {
      birth_day,
      birth_mon,
      birth_year,
      blood_type,
      images,
      infobox,
      stat,
      gender,
      ...others
    } = char;
    for (const key in images) {
      images[key] = images[key].replace("https://lain.bgm.tv", "");
      if (key === "large") {
        images["avatar"] = images[key].replace("/pic/crt/l", "/pic/crt/g");
      }
    }
    const infoKeys = [
      { name: "中文名", field: "nameCn" },
      { name: "别名", field: "aliasName" },
      { name: "性别", field: "gender" },
      { name: "生日", field: "birth" },
      { name: "引用来源", field: "source" }
    ];
    let aliasName, nameCn, birthDay, birthDesc;
    birthDay = [birth_year, birth_mon, birth_day].reduce((prev, curr) => {
      return prev ? `${prev}-${curr || ""}` : curr;
    }, null);
    const info = infobox == null ? void 0 : infobox.reduce((prev, curr) => {
      const item = infoKeys.find((v) => curr.key.includes(v.name));
      if (item) {
        if (item.field === "nameCn" && !nameCn) {
          nameCn = curr.value;
        } else if (item.field === "aliasName" && !aliasName) {
          aliasName = curr.value;
        } else if (item.field === "gender" && !gender) {
          gender = curr.value === "男" ? "male" : "female";
        } else if (item.field === "birth") {
          birthDesc = curr.value;
        }
      } else {
        !prev && (prev = {});
        prev[curr.key] = curr.value;
      }
      return prev;
    }, null);
    return {
      ...others,
      info: info && JSON.stringify(info),
      nameCn,
      gender,
      birthDay,
      birthDesc,
      bloodType: blood_type,
      aliasName: aliasName && JSON.stringify(aliasName),
      bgmImages: JSON.stringify(images)
    };
  };
  const formatSub = (subject) => {
    var _a, _b;
    let {
      id,
      tags,
      images,
      name_cn,
      rating: { score, total },
      date,
      infobox,
      total_episodes,
      collection,
      ...others
    } = subject;
    let aliasName, openTv, otherTv, startDate, endDate, copyright, official, original, director, charSetting;
    for (const key in images) {
      images[key] = (_a = images[key]) == null ? void 0 : _a.replace("https://lain.bgm.tv", "");
      if (key === "large") {
        images["avatar"] = (_b = images[key]) == null ? void 0 : _b.replace("/pic/cover/l", "/pic/cover/g");
      }
    }
    const tagsString = tags == null ? void 0 : tags.reduce((prev, curr, index) => {
      return index > 15 ? prev : prev ? `${prev},${curr.name}` : curr.name;
    }, "");
    const infoBox = infobox == null ? void 0 : infobox.filter((item) => {
      if (item.key === "中文名") {
        !name_cn && (name_cn = item.value);
        return false;
      } else if (item.key === "别名") {
        aliasName = JSON.stringify(item.value);
        return false;
      } else if (item.key === "话数") {
        !total_episodes && (total_episodes = +item.value);
        return false;
      } else if (item.key === "放送开始") {
        startDate = onGetDate(item.value) || item.value;
        return false;
      } else if (item.key === "播放结束") {
        endDate = onGetDate(item.value) || item.value;
        return false;
      } else if (item.key === "官方网站") {
        official = item.value;
        return false;
      } else if (item.key === "播放电视台") {
        openTv = item.value;
        return false;
      } else if (item.key === "其他电视台") {
        otherTv = item.value;
        return false;
      } else if (item.key === "Copyright") {
        copyright = item.value;
        return false;
      } else if (item.key === "原作") {
        original = item.value;
        return false;
      } else if (item.key === "导演") {
        director = item.value;
        return false;
      } else if (item.key === "人物设定" || item.key === "角色设定") {
        charSetting = item.value;
        return false;
      } else {
        return true;
      }
    });
    return {
      ...others,
      bgmId: id,
      nameCn: name_cn,
      tags: tagsString,
      bgmScore: score,
      bgmRaters: total,
      infoBox: JSON.stringify(infoBox),
      startDate,
      endDate,
      aliasName,
      broadcast: JSON.stringify({
        openTv,
        otherTv
      }),
      info: JSON.stringify({
        copyright,
        official,
        original,
        director,
        charSetting
      }),
      bgmImages: JSON.stringify(images),
      totalEpisodes: total_episodes
    };
  };
  const formatRoles = (list, isChar = false, isCv = false) => {
    if (!Array.isArray(list)) return null;
    let data = list;
    if (isChar) {
      let totalActors = [];
      data = list.map((v) => {
        let { actors, images, locked, ...others } = v;
        for (const key in images) {
          images[key] = images[key].replace("https://lain.bgm.tv", "");
          if (key === "large") {
            images["avatar"] = images[key].replace("/pic/crt/l", "/pic/crt/g");
          }
        }
        const itemCvs = formatRoles(actors, false, true);
        totalActors = totalActors.concat(itemCvs);
        return {
          ...others,
          locked: locked || false,
          isCv,
          actors: (itemCvs == null ? void 0 : itemCvs.length) ? JSON.stringify(
            itemCvs.map((v2) => ({ name: v2.name, id: v2.id }))
          ) : null,
          bgmImages: JSON.stringify(images)
        };
      });
      return { data, actors: totalActors };
    } else {
      const whiteListByCount = ["作画监督", "副导演", "原画", "补间动画"];
      const whiteList = [
        "原作",
        "导演",
        "人物原案",
        "人物设定",
        "音乐",
        "总作画监督",
        "脚本",
        "系列构成",
        "美术监督",
        "摄影监督"
      ];
      const relMaps = list.reduce((prev, curr) => {
        if (Object.hasOwn(prev, curr.relation)) {
          ++prev[curr.relation];
        } else {
          prev[curr.relation] = 1;
        }
        return prev;
      }, {});
      if (!isCv) {
        data = list.filter((v) => {
          if (!v.relation) return false;
          if (whiteList.includes(v.relation)) {
            return true;
          } else if (whiteListByCount.includes(v.relation)) {
            return relMaps[v.relation] < 7;
          } else {
            return false;
          }
        });
      }
      data = data.map((v) => {
        let { career, images, short_summary, locked, relation, ...others } = v;
        for (const key in images) {
          images[key] = images[key].replace("https://lain.bgm.tv", "");
          if (key === "large") {
            images["avatar"] = images[key].replace("/pic/crt/l", "/pic/crt/g");
          }
        }
        return {
          ...others,
          locked: locked || false,
          isCv,
          summary: isCv ? short_summary : relation,
          bgmImages: JSON.stringify(images),
          career: career && career.join(",")
        };
      });
      return data;
    }
  };
  const onGetDate = (dateString) => {
    if (!dateString) return null;
    const dateParts = dateString.match(/(\d{4})年(\d{1,2})月(\d{1,2})日/);
    if (dateParts) {
      const year = parseInt(dateParts[1], 10);
      const month = parseInt(dateParts[2], 10) - 1;
      const day = parseInt(dateParts[3], 10);
      return new Date(year, month, day);
    } else {
      return null;
    }
  };
  init();

})();