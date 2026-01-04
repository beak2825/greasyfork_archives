// ==UserScript==
// @name         libgen douban info
// @namespace    http://tampermonkey.net/
// @version      0.1.7
// @description  libgen上传页面豆瓣信息自动填充
// @author       xiangzi fang
// @include      http://librarian.libgen.lc/librarian/form.php
// @include      http://librarian.bksrc.net/librarian/form.php
// @include      https://libgen.is/librarian/form.php
// @include      http://librarian.libgen.lc/librarian/registration.php*
// @include      https://libgen.is/librarian/registration.php*
// @include      http://librarian.bksrc.net/librarian/registration.php*
// @grant        GM_xmlhttpRequest
// @connect      book.douban.com
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @home-url     https://github.com/fqxufo/libgen_doubaninfo
// @downloadURL https://update.greasyfork.org/scripts/392419/libgen%20douban%20info.user.js
// @updateURL https://update.greasyfork.org/scripts/392419/libgen%20douban%20info.meta.js
// ==/UserScript==

(function() {
  "use strict";
  console.log("hello");

  let div_add = `<div style="background-color: #ccc;">
<span style="color: #298a31;">抓取豆瓣信息</span><input type="button" value="豆瓣" id="douban_button">
<input type="text" name="" id="douban_url" placeholder="https://book.douban.com/subject/27079479/" style="width:360px">
</div>`;

  if (window.location.href.includes("registration")) {
    console.log("修改页面中");
    $("body > form:nth-child(13) > table").after(div_add);
  } else {
    $("body > form:nth-child(11) > table").after(div_add);
  }
  let link = $("#douban_url");

  let doubanBtn = $("#douban_button");

  doubanBtn.click(function() {
    console.log(link.val());
    let url = encodeURI(link.val());

    //自动选中中文语言选项
    $("input[name='Language']").val("Chinese");
    $("select[name='langselect']").val("Chinese");

    //请求豆瓣页面
    GM_xmlhttpRequest({
      method: "GET",
      url: url,
      onload: function(response) {
        if (response.status === 200) {
          let data = response.response;

          let wrapper = $(data).filter("#wrapper");
          console.log(wrapper);
          //封面图片url
          let coverImg_url = wrapper.get(0).querySelector("#mainpic > a > img")
            .src;
          console.log("封面图片url: ", coverImg_url);
          // $("input[name='Coverurl']").val(coverImg_url)

          let info = wrapper.get(0).querySelector("#info");
          let title_str = wrapper
            .find("h1")
            .children("span")
            .text();
          console.log("原标题:", title_str);
          $("#id_title").val(
            wrapper
              .find("h1")
              .children("span")
              .text()
          );
          let info_list = info.querySelectorAll(".pl");
          let info_val_list = {};
          for (let i = 0; i < info_list.length; i++) {
            info_val_list[info_list[i].innerText.replace(/ |:/g, "")] =
              info_list[i];
          }
          console.log(info_val_list);
          let data_list = [
            "作者",
            "译者",
            "出版社",
            "ISBN",
            "副标题",
            "原作名",
            "出版年",
            "页数",
            "丛书"
          ];
          try {
            //作者加译者
            let authors = info_val_list[data_list[0]];
            let translators = info_val_list[data_list[1]];

            let authors_str = "";
            if (authors.parentNode.id == "info") {
              authors_str = authors.nextElementSibling.innerText;
            } else {
              authors_str = Array.from(authors.parentNode.querySelectorAll("a"))
                .map(function(currentValue) {
                  return currentValue.innerText;
                })
                .join(",");
            }
            console.log("作者", authors_str);
            let authors_all_str = authors_str;
            if (translators) {
              let translators_str = "";
              if (translators.parentNode.id == "info") {
                translators_str = translators.nextElementSibling.innerText;
              } else {
                translators_str = Array.from(
                  translators.parentNode.querySelectorAll("a")
                )
                  .map(function(currentValue) {
                    return currentValue.innerText;
                  })
                  .join(",");
              }
              console.log("译者", translators_str);
              authors_all_str = authors_all_str + "," + translators_str;
            }

            console.log("作者加译者:", authors_all_str);
            authors_all_str = authors_all_str
              .trim()
              .replace(/\r\n/g, "")
              .replace(/\[.*?\]/g, "");
            $("#1").val(authors_all_str);
          } catch (err) {}

          try {
            //出版社
            let publisher = info_val_list[data_list[2]];
            let publisher_str = publisher.nextSibling.nodeValue.replace(
              /\n| /g,
              ""
            );
            console.log("出版社:", publisher_str);
            $("input[name='Publisher']").val(publisher_str);
          } catch (err) {}
          try {
            //ISBN号码
            let isbn13 = info_val_list[data_list[3]];
            let isbn_str = isbn13.nextSibling.nodeValue.replace(/\n| /g, "");
            console.log("ISNB号码:", isbn_str);
            $("input[name='Identifier']").val(isbn_str);
          } catch (err) {}

          try {
            let title_all_str = title_str;
            //副标题,原作名
            let subtitle = info_val_list[data_list[4]];
            let originalTitle = info_val_list[data_list[5]];
            if (subtitle) {
              let subtitle_str = subtitle.nextSibling.nodeValue.replace(
                /\n| /g,
                ""
              );
              console.log("副标题:", subtitle_str);
              title_all_str = title_all_str + ":" + subtitle_str;
            }

            if (originalTitle) {
              let originalTitle_str = originalTitle.nextSibling.nodeValue.replace(
                /(^\s*)|(\s*$)/g,
                ""
              );
              console.log("原作名:", originalTitle_str);
              title_all_str = title_all_str + " " + originalTitle_str;
            }

            console.log("全标题:", title_all_str);
            $("#2").val(title_all_str);
          } catch (err) {}

          try {
            //出版年份
            let publishTime = info_val_list[data_list[6]];
            let publishTime_str = publishTime.nextSibling.nodeValue.replace(
              /\n| /g,
              ""
            );
            console.log("出版年份:", publishTime_str);
            $("input[name='Year']").val(publishTime_str);
          } catch (err) {}

          try {
            //页数
            let pagenum = info_val_list[data_list[7]];
            let pagenum_str = pagenum.nextSibling.nodeValue.replace(
              /\n| /g,
              ""
            );
            console.log("页数:", pagenum_str);
            $("input[name='Pages']").val(pagenum_str);
          } catch (err) {}

          try {
            //丛书
            let series = info_val_list[data_list[8]];
            if (series) {
              let series_str = series.nextElementSibling.innerText;
              console.log("丛书:", series_str);
              $("input[name='Series']").val(series_str);
            }
          } catch (err) {}

          try {
            //内容简介
            let related_info = wrapper.get(0).querySelector("#link-report");
            $(related_info.querySelector(".short")).remove();
            related_info = related_info.querySelector(".intro");
            let related_info_list = related_info.querySelectorAll("p");
            let summ_str = Array.from(related_info_list)
              .map(function(currentValue) {
                return currentValue.innerText;
              })
              .join("\n");
            console.log("内容简介：", summ_str);

            $("textarea[name='Description']").val(summ_str);
          } catch (err) {}

          try {
            let tags = wrapper.get(0).querySelectorAll("a.tag");
            let tags_str = Array.from(tags)
              .map(function(currentValue) {
                return currentValue.innerText;
              })
              .join(";")
              .replace("我想读这本书", "");
            console.log("TAGS:", tags_str);
            $("input[name='Tags']").val(tags_str);
          } catch (err) {}
        } else {
          alert("error: " + url + " " + response.status);
        }
      }
    });
  });
})();
