// ==UserScript==
// @name         slader-infinite
// @namespace    https://greasyfork.org/en/users/94062-oshaw
// @version      2.0.1
// @description  Browse textbook answers on Slader.com in faster, cleaner interface.
// @author       Oscar Shaw
// @include      *://slader.*
// @grant        GM_xmlhttpRequest
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @run-at       document-start
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/26910/slader-infinite.user.js
// @updateURL https://update.greasyfork.org/scripts/26910/slader-infinite.meta.js
// ==/UserScript==
function tag(str_tag) {
  switch (str_tag[0]) {
    case '.': return document.getElementsByClassName(str_tag.substring(1));
    case '#': return document.getElementById(str_tag.substring(1));
    default: return document.getElementsByTagName(str_tag);
  }
}
function view(str) {
  window.open().document.body.appendChild(document.createElement('pre')).innerHTML= str;
}
function attempt(anon) {
  try {
    anon();
  }
  catch(str_error) {
    console.log(str_error);
  }
}
function def(var_input) {
  return !(var_input == null || var_input == undefined || var_input == "");
}
function numeric(char_input) {
  return ("1234567890".indexOf(char_input) != -1); 
}
function get(url, anon) {
  GM_xmlhttpRequest({
    method: "GET",
    url: url,
    onload: function(kvp) { anon(kvp.responseText); }
  });
}
function trimSpaces(str) {
  var int_start = 0;
  var int_end = str.length - 1;
  for (var i = 0; i < str.length; i++) { 
    if (str[i] != ' ' && str[i] != "\n") { 
      int_start = i;
      break;
    }
  }
  for (var i = str.length-1; i >= 0; i--) {
    if (str[i] != ' ' && str[i] != "\n") {
      int_end = i;
      break;
    }
  }
  return str.substring(int_start, int_end+1);
}
function urlEncode(url) {
  var url_output = "";
  for (var i=0; i < url.length; i++) {
    url_output += (url[i] == ' ') ? "+" : url[i];
  }
  return url_output;
}
function clearBody() {
  window.stop();
  $("body").html("");
}
function titleCase(str) {
 return str.replace(
    /\w\S*/g,
    function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    }
  );
}
function class_sladerClient() {
  var kvp_textbook = { chapters: [] };
  var kvp_query = {};
  var url_base = "http://slader.com";
  var int_chapter = -1;
  var int_section = -1;
  var int_question = -1;
  var int_searchResults = 20;
  var bool_getLargeImages = false;
  function func_dirToHeader(url) {
    if (url.indexOf("#concept-check") != -1) {
      return "Review: Concept Check";
    }
    else if (url.indexOf("#review-exercises") != -1) {
      return "Exercises";
    }
    else if (url.indexOf("#review-true-false-quiz") != -1) {
      return "Review: True-False Quiz";
    }
    else if (url.indexOf("#problems-plus") != -1) {
      return "Problems Plus";
    }
    else return "Exercises";
  }
  function model_getTextbookResults(str_query) {
    if (!def(str_query)) return;
    kvp_query = {
      str_query: str_query,
      textbooks: []
    }
    GM_xmlhttpRequest({
      method: "POST",
      url: (
         "https://8bbzgj41nl-dsn.algolia.net/"
        + "1/indexes/*/queries?"
        + "x-algolia-agent=Algolia%20for%20vanilla%20JavaScript%203.20.3"
        + "&x-algolia-application-id=8BBZGJ41NL"
        + "&x-algolia-api-key=ecc53b33402d31d49ed35804e2707bd6"
      ),
      data: (
        '{"requests":[{"indexName":"textbook_index",\
        "params":"query=' + kvp_query.str_query
        + '&hitsPerPage=' + int_searchResults + '&page=0"}]}'
      ),
      onload: function(kvp) {
        var kvps_results = JSON.parse(kvp.responseText).results[0].hits;
        $.each(kvps_results, function(i, kvp_result) {
          kvp_query.textbooks.push({
            str_name: kvp_result.title,
            str_edition: kvp_result.edition,
            str_author: kvp_result.authors_string,
            str_isbn: kvp_result.isbn,
            url_thumbnail: kvp_result.search_thumbnail,
            url_path: kvp_result.get_absolute_url,
            chapters: []
          });
        });
        view_addTextbookResults();
      }
    });
  }
  function model_getTextbookContents(int_textbookIndex) {
    get(kvp_query.textbooks[int_textbookIndex].url_path, function(html) {
      var jsects_chapters = (
        $("<div/>")
        .html(html)
        .find(".toc-item")
      );
      kvp_textbook = kvp_query.textbooks[int_textbookIndex];
      kvp_textbook.chapters = [];
      $.each(jsects_chapters, function(i, sect_chapter) {
        var jsect_chapter = $("<div/>").html(sect_chapter.innerHTML);
        kvp_textbook.chapters.push({
          str_number: i + 1,
          str_name: trimSpaces(
            jsect_chapter
            .find(".chapter").eq(0)
            .find("p").eq(0).text()
          ),
          sections: []
        });
        $.each(jsect_chapter.find(".exercise-group"), function(j, tr) {
          kvp_textbook.chapters[i].sections
            .push({ questions: [] });
          kvp_textbook.chapters[i].sections[j]
            .url_pageStart = url_base + tr.getAttribute("data-url");
          var jtr = $("<div/>").html(tr.innerHTML);
          $.each(jtr.find("td"), function(k, td) {
            switch (k) {
              case 0: {
                kvp_textbook
                  .chapters[i].sections[j]
                  .str_number = trimSpaces(td.textContent);
                break;
              }
              case 1: {
                if (def(trimSpaces(td.textContent))) {
                  kvp_textbook
                    .chapters[i].sections[j]
                    .str_name = trimSpaces(td.textContent);
                }
                break;
              }
              case 2: {
                if (!def(kvp_textbook
                  .chapters[i].sections[j]
                  .str_name)) {
                  kvp_textbook
                    .chapters[i].sections[j]
                    .str_name = trimSpaces(td.textContent);
                }
                break;
              }
              case 3: {
                kvp_textbook
                  .chapters[i].sections[j]
                  .int_pageStart = parseInt(
                  td.textContent.substring(2)
                );
                break;
              }
              default: break;
            }
          });
        });
      });
      view_pageTextbookContents();
    });
  }
  function model_getQuestionsInSection(int_chapterIndex, int_sectionIndex) {
    int_chapter = int_chapterIndex;
    int_section = int_sectionIndex;
    { var int_page = (
      kvp_textbook.chapters[int_chapter]
      .sections[int_section].int_pageStart
    ); }
    { var url = kvp_textbook.url_path + int_page; }
    { var str_header = func_dirToHeader(
      kvp_textbook.chapters[int_chapter]
      .sections[int_section].url_pageStart
    ); }
    var anon_loopThroughPages = function() {
      model_getQuestionsOnPage(
        url_base + kvp_textbook.url_path + int_page,
        str_header,
        int_page,
        function(int_next) {
          int_page = int_page + 1;
          if (int_page == int_next) anon_loopThroughPages();
        }
      );
    }
    view_addQuestionPageHeader();
    anon_loopThroughPages();
  }
  function model_getQuestionsOnPage(url, str_header, int_page, anon_callback) {
    get(url, function(html) {
      var jdivs_questions = $("<div/>").html(html).find(".list").children();
      var bool_inSection = false;
      $.each(jdivs_questions, function(i, div_question) {
        var bool_isHeader = false;
        if (div_question.tagName == "H3") {
          bool_isHeader = true;
          if (div_question.textContent == str_header) {
            bool_inSection = true;
          }
          else bool_inSection = false;
        }
        if (bool_inSection && !bool_isHeader) {
          var jdiv_question = $("<div/>").html(div_question);
          var str_number = jdiv_question.find(".answer-number").eq(0).text();
          str_number = str_number.substring(0, str_number.indexOf('.'));
          var url_solutions = div_question.getAttribute("data-url");
          var kvp_question = ({
            str_number: str_number,
            url_solutions: url_base + url_solutions,
            solutions: []
          });
          if (i == 1) kvp_question.int_page = int_page;
          var jp_answer = (jdiv_question.find(".answer").eq(0));
          $.each(jp_answer.children(), function(j, lmt) {
            if (lmt.tagName == "IMG") {
              if (bool_getLargeImages
                  && lmt.src.indexOf("large") != -1) {
                kvp_question.url_imgAnswer = lmt.src;
              } else if (lmt.src.indexOf("large") == -1) {
                kvp_question.url_imgAnswer = lmt.src;
              }
            }
          });
          if (!def(kvp_question.url_imgAnswer)) {
            kvp_question.str_answer = trimSpaces(jp_answer.text());
          }
          kvp_textbook.chapters[int_chapter]
            .sections[int_section].questions.push(kvp_question);
        }
      });
      view_addUnaddedQuestions();
      anon_callback(parseInt($("<div/>").html(html).find(".next").eq(0).text()));
    });
  }
  function model_getSolutions(int_questionIndex) {
    int_question = int_questionIndex;
    var url_solution = (
      kvp_textbook.chapters[int_chapter]
      .sections[int_section].questions[int_question].url_solutions
    );
    get(url_solution, function(html) {
      GM_xmlhttpRequest({
        method: "GET",
        url: "https://slader.com" + (
          $("<div/>").html(html).find(".left").eq(0)
          .children().eq(2).attr("data-url")
        ),
        headers: { "X-Requested-With": "XMLHttpRequest" },
        onload: function(kvp) {
          var jartcs_solutions = (
            $("<div/>").html(kvp.responseText)
            .find("article")
          );
          $.each(jartcs_solutions, function(i, artc_solution) {
            { kvp_textbook.chapters[int_chapter]
              .sections[int_section].questions[int_question]
              .solutions.push({ steps: [] }); }
            { var kvp_solution = (
              kvp_textbook
              .chapters[int_chapter].sections[int_section]
              .questions[int_question].solutions[i]
            ); }
            { kvp_solution.str_answerer = titleCase(
              $(artc_solution).find(".profile-name").eq(0)
              .text()
            ); }
            var jartc_solution = $("<div/>").html(artc_solution);
            { var jdivs_steps = (
              jartc_solution.find(".solution-row.explanation-row")
            ); }
            $.each(jdivs_steps, function(j, div_step) {
              kvp_textbook
                .chapters[int_chapter].sections[int_section]
                .questions[int_question].solutions[i]
                .steps.push({
                  url_imgWork: "",
                  str_work: "",
                  url_imgExplain: "",
                  str_explain: ""
                });
              var jdivs_cells = (
                $("<div/>").html(div_step)
                .find(".solution-content")
              );
              $.each(jdivs_cells, function(k, div_cell) {
                var jlmts = (
                  $("<div/>").html(div_cell)
                  .children().eq(0).children()
                );
                var kvp_step = (
                  kvp_textbook
                  .chapters[int_chapter]
                  .sections[int_section]
                  .questions[int_question]
                  .solutions[i].steps[j]
                );
                $.each(jlmts, function(l, lmt) {
                  switch (lmt.tagName) {
                    case "IMG": {
                      if (lmt.src.indexOf("large") == -1 && bool_getLargeImages) break;
                      if (lmt.src.indexOf("large") != -1 && !bool_getLargeImages) break;
                      if (!def(kvp_step.url_imgWork) && !def(kvp_step.p_work)) {
                        kvp_step.url_imgWork = lmt.src;
                      }
                      else kvp_step.url_imgExplain = lmt.src;
                      break;
                    }
                    case "P": {
                      if (lmt.classList.contains("center")) break;
                      if (!def(kvp_step.url_imgWork) && !def(kvp_step.p_work)) {
                        kvp_step.str_work = trimSpaces(lmt.textContent);
                      }
                      else kvp_step.str_explain = trimSpaces(lmt.textContent);
                      break;
                    }
                    case "A": {
                      if (!def(kvp_step.url_imgWork) && !def(kvp_step.p_work)) {
                        kvp_step.url_imgWork = lmt.getElementsByTagName("IMG")[0].src;
                      }
                      else kvp_step.url_imgExplain = lmt.getElementsByTagName("IMG")[0].src;
                      break;
                    }
                    default: break;
                  }
                });
              });
            });
            { var jlmts_answerElements = (
              jartc_solution
              .find(".solution-row.result-row").eq(0)
              .find(".solution-content").eq(0).children()
            ); }
            $.each(jlmts_answerElements, function(j, lmt) {
              switch (lmt.tagName) {
                case "IMG": {
                  if (lmt.src.indexOf("large") == -1 && bool_getLargeImages) break;
                  if (lmt.src.indexOf("large") != -1 && !bool_getLargeImages) break;
                  kvp_solution.url_imgAnswer = lmt.src;
                  break;
                }
                case "P": {
                  kvp_solution.str_answer = trimSpaces(lmt.textContent);
                  break;
                }
                default: break;
              }
            });
          });
          view_pageSolutions();
        }
      });
    });
  }
  var kvp_colors = {
    css_black: "rgb(38, 38, 38)",
    css_graySearch: "rgb(127, 127, 127)",
    css_grayText: "rgb(191, 191, 191)",
    css_blueMask: "rgb(229, 241, 255)",
    css_grayLine: "rgb(217, 217, 217)",
    css_blueBg: "rgb(229, 241, 255)",
    css_grayBg: "rgb(237, 237, 237)",
    css_whiteBg: "rgb(255, 255, 255)"
  }
  var kvp_images = {
     uri_search: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADEAAAAzCAMAAAF+jSCzAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAACTUExURQAAAD8/Px8fHyoqKh8fHyYmJioqKiUlJScnJyMjIygoKCUlJSQkJCYmJicnJyUlJSYmJiUlJSYmJiUlJSYmJiUlJSUlJSUlJSUlJSYmJiUlJSYmJiUlJSUlJSYmJiYmJiUlJSUlJSYmJiUlJSUlJSUlJSUlJSYmJiUlJSUlJSUlJSYmJiUlJSYmJiUlJSYmJiYmJh9o+NMAAAAwdFJOUwAECAwQFBgbICQsMDg8VFhcYGRscHR8gJufo6err7O7v8PHy8zT19vf4efv8/f7+zSf2k8AAAAJcEhZcwAAFxEAABcRAcom8z8AAAJISURBVDhPxZXpdhoxDIXNWhIKaYCkFAIFWgKlw9Tv/3TVla6XWchJ86ffgfGVZJmxLRvn3GYgD+e8AEseaAdsgx/so8DjgAej8n2QLz5qeq9dRLEF6BvHMuH9Ec3BrBGj0utBdOjqjqL3cUhDbG2/nJfaCvcY3l/MUM3hpZXn3DLib7QYm2Q8en/tfbNM5646GA3XE/UcLaVuUVQ4YQTwSIdhrx240itY/3vIrcqeumXO0Q/03ajPmbb3DNayEsHEogXt56ZL6GfTwkVjkZ90K9iVjMruRGSbPhqjepPB8nDeVpcTyOYZlw49Rj6dz/SBgj5jQq9zP+gJhNG6an2HvFPJorMpfaWhkUyX1JbDBYecmRRg7ZLsmxRgFUmOTQqwTkm+mBRgrZOMy7mCcWd6Ac3XsjUzzRS/GvWmVvoL+jnfRKhJ56b0BFLkdo7DMRJeP1mbRQJaxB+LVDdf0UicTI5EWv0SueFv0J3v9fyQ/aLLQDvDenkpR+5Nk0m1TDOKKbtUGNZOb5VL83fisRHK7Wzc749nm3xGrNmIXKmkDEWvPKWkdJeAQQzo4cl5YcD7ET2K3ltgS0eGljJY0aHIn4mRDkkE/yoKj4yhtyZI5y3CUoqnz7D7WGjePekc8CAbcW3LxroPw79LrQDtfgRP9JC0T6/0kG624+u4jMO4Tt7/rk+xU7vG6/xqqeHbhajsW06km7xZjO05nXkj6Q9b0JojjOar3akoTrv1AmvdS+t4O6fG/8h57y0Tct7bHyDnX/oD3p7O/QU6/7WrNM7DhwAAAABJRU5ErkJggg=="
    , uri_back: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADQAAAAtCAMAAAGheIgcAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAtUExURQAAACoqKioqKiUlJSYmJiUlJSQkJCYmJiUlJSUlJSUlJSYmJiUlJSUlJSYmJv/1pYIAAAAOdFJOUwAMGGx4j5+fw9fY3d/lzwLVSgAAAAlwSFlzAAAXEQAAFxEByibzPwAAAQNJREFUOE/dlOuywiAMhEE9inrk/R/XEBYIlwjtjI7j90OyLktpuZiC97KhluDCsTbmD20Evfn3gc4O2ZQoowUwHsOBSJDO56cwpI8oeyrHeTEtil1RNuLeiMSFJEoiqGqaxESiVanmJ6HpEScoQTTKbDOqId6nwO8SF6aFrbEJKz2sWpTC1FTeuVm7Cou2x9afXECO4rEz9OAcIAUfdhp0Z2a9GFDxopW84Zd/owdVwx7qFvJQ9ejbZg2rHlAVigS2xBAJrMZEhA79YBv1fG/khu6BxYi81HZEJqR77gy9RL4c7fheHZJDW2IiRLF//Btwyxu+Wqffje04hjsO/NbIDGOerNknYTaMYyIAAAAASUVORK5CYII="
    , uri_cross: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAtCAMAAAGVAUkAAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAtUExURQAAAD8/PyoqKioqKicnJyUlJSUlJSYmJiYmJiUlJSUlJSUlJSUlJSUlJSYmJvl4FQgAAAAOdFJOUwAEDBhUWGBwd7/D09f7tQnJcwAAAAlwSFlzAAAXEQAAFxEByibzPwAAAYBJREFUOE+FkwF2gzAMQzNYy0Yp9z/uLFkhNkk6vY7Y8l+wA5Sq0372ZxdcPcaVHmIJBfwCZtBZVgZlo20hc8JOMlDE0JO8jHXuvhiyn0wM/1biIZMaeqIQgDZAeCgh4LuJteTXEv+3/c0latMmEge0cdvuJmQseDdeYBg7Q4HL1aPJC1AwITcPZZKbUOjKDY5lUoFxnYoxCmszIRR84jXf3U7kk85FAbWpSdss+HZE9HHH5vPgzF9oV58uO4l+c6Mf3eZn9/Kp5kY/us3Pbik/boe5IL+bKfmXm3x1xmvza79trujGeaMb/SeD2q98i+xND1PQ57M9gktfT/zli7Tk92CoR5iu05PfRxVa32c4iseF+5QTvBYdfyiDOryi0OvLjKV9Yjc8ou86+BgfolCPT1Eo43q7qA6FEn5piEI9PkWhjH9E81im4WOSbig0wwcoNMLzufbnHtQ/gineo9AQH6NQj6/4DF39uQZcReE9CgkPRcPHKGT4rYiv4B+V8gdsgyznJwkzBgAAAABJRU5ErkJggg=="
  }
  var bool_displayQuestions = false;
  var bool_viewingSolution = false;
  var bool_searchingTextbook = false;
  var int_iconFrameSize = 48;
  var int_iconSize = 20;
  var int_iconToTextPadding = 10;
  var int_searchMaskPercentOpacity = 30;
  var int_leftPadding = int_iconFrameSize + int_iconToTextPadding;
  function view_formatTextLarge(jp, bool_bold = true) {
    jp.css({
      "color": kvp_colors.css_black,
      "font-size": "16px",
      "font-weight": (bool_bold) ? "bold" : "normal"
    });
  }
  function view_formatTextSmall(jp, bool_gray = false) {
    jp.css({
      "color": (bool_gray)
              ? kvp_colors.css_grayText
: kvp_colors.css_black,
      "font-size": "12px"
    });
  }
  function view_formatBlueBgOnHover(jdiv, jdiv_applyEffectTo = null) {
    if (!def(jdiv_applyEffectTo)) jdiv_applyEffectTo = jdiv;
    jdiv.hover(function() {
      $(jdiv_applyEffectTo).css("backgroundColor", kvp_colors.css_blueBg);
    }, function() {
      $(jdiv_applyEffectTo).css("backgroundColor", kvp_colors.css_whiteBg);
    });
	}
	function view_formatGrayBgOnHover(jdiv, jdiv_applyEffectTo = null) {
    if (!def(jdiv_applyEffectTo)) jdiv_applyEffectTo = jdiv;
    jdiv.hover(function() {
      $(jdiv_applyEffectTo).css("backgroundColor", kvp_colors.css_grayBg);
    }, function() {
      $(jdiv_applyEffectTo).css("backgroundColor", kvp_colors.css_whiteBg);
    });
  }
  function view_addBackHeader(str_title, str_subtitle, anon_onClick) {
    var uri_back = kvp_images.uri_back;
    { $("body").append(
       '<div id="div_header">'
      + '<div id="div_imgBackWrapper">'
      + '<img id="img_back" src="' + uri_back + '">'
      + '</div>'
      + '<div id="div_headerDetailWrapper">'
      + '<p id="p_headerTitle">' + str_title + '</p>'
      + '<p id="p_headerSubtitle">' + str_subtitle + '</p>'
      + '</div>'
      + '</div>'
    ); }
    $("#div_header").css({
      "background-color": kvp_colors.css_grayBg,
      "display": "flex"
    });
    $("#div_imgBackWrapper").click(anon_onClick);
    $("#div_imgBackWrapper").css({
      "cursor": "pointer",
      "display": "flex",
      "flex-shrink": "0",
      "height": int_iconFrameSize.toString() + "px",
      "width": int_iconFrameSize.toString() + "px"
    });
    $("#img_back").css({
      "bottom": "0",
      "display": "flex",
      "margin": "auto",
      "height": int_iconSize.toString() + "px",
      "width": int_iconSize.toString() + "px",
    });
    $("#div_headerDetailWrapper").css({
      "display": "flex",
      "flex-direction": "column",
      "justify-content": "center",
      "padding-left": int_iconToTextPadding.toString() + "px"
    });
    view_formatTextLarge($("#p_headerTitle"));
    view_formatTextSmall($("#p_headerSubtitle"));
  }
  function view_addTextbookSearch(str_query = "") {
    clearBody();
    var str_placeholder = "Search textbooks";
    var html_iconSearch = kvp_images.uri_search;
    { $("body").append(
       '<div id="div_searchDummy"></div>'
      + '<div id="div_search">'
      + '<div id="div_imgSearchWrapper">'
      + '<img id="img_search" src="' + html_iconSearch + '">'
      + '</div>'
      +   '<div id="div_intextWrapper">'
      + '<input id="intext" type="text"'
      +      'placeholder="' + str_placeholder
      +      '">'
      +     '</input>'
      + '</div>'
      + '</div>'
    ); }
    $(document).keypress(function(int_keycode) {
      if (int_keycode.which == 13
        && $("#intext").is(':focus')
        && !bool_searchingTextbook) {
        if (kvp_query.str_query != $("#intext").val()) {
          bool_searchingTextbook = true;
          model_getTextbookResults($("#intext").val());
        } else view_addTextbookResults();
      }
    });
    $("#div_imgSearchWrapper").click(function() { $("#intext").focus(); });
    $("#div_searchDummy").css({
      "height": int_iconFrameSize.toString() + "px"
    });
    $("#div_search").css({
      "background-color": kvp_colors.css_whiteBg,
      "border-bottom": "1px solid",
			"display": "flex",
			"flex-direction": "row",
      "position": "absolute",
      "top": "0",
      "width": "100%"
    });
    $("#div_imgSearchWrapper").css({
      "cursor": "pointer",
      "display": "flex",
      "flex-shrink": "0",
      "height": int_iconFrameSize.toString() + "px",
      "width": int_iconFrameSize.toString() + "px"
    });
    $("#div_intextWrapper").css({
      "padding-left": int_iconToTextPadding.toString() + "px",
      "width": "100%"
    });
    $("#img_search").css({
      "bottom": "0",
      "display": "flex",
      "margin": "auto",
      "height": int_iconSize.toString() + "px",
      "width": int_iconSize.toString() + "px",
    });
    $("#intext").css({
      "border-style": "none",
			"font-size": "1em",
			"height": "100%",
      "width": "100%"
    });
    if (def(str_query)) $("#intext").val(str_query);
  }
  function view_clearTextbookResults() {
    $("#div_searchResultsWrapper").remove();
    $("#div_searchMask").remove();
    $("#div_noResults").remove();
    $.each($(".div_textbook"), function(i, div_textbook) {
      $(div_textbook).remove();
    });
    $("body").css({
      "overflow": "scroll",
      "overflow-x": "hidden"
    });
    $("#img_search").attr("src", kvp_images.uri_search);
    $("#div_imgSearchWrapper").click(function() { $("#intext").focus(); });
  }
  function view_addTextbookResults() {
    bool_searchingTextbook = false;
    view_clearTextbookResults();
    { var str_noResultsSubtitle = (
      "No results for \""
      + kvp_query.str_query
      + "\""
    ); }
    { $("body").append(
       '<div id="div_searchResultsWrapper"></div>'
      + '<div id="div_searchMask"></div>'
    ); }
    $("#div_searchResultsWrapper").css({
      "height": "100%",
      "overflow-y": "scroll",
      "position": "absolute",
      "top": int_iconFrameSize.toString() + "px",
      "width": "100%",
      "z-index": 1
    });
    $("#div_searchMask").css({
      "background-color": kvp_colors.css_black,
      "height": "100%",
      "opacity": "0." + int_searchMaskPercentOpacity.toString(),
      "position": "absolute",
      "top": int_iconFrameSize.toString() + "px",
      "width": "100%",
      "z-index": 0
    });
    $("#div_search").css({
      "z-index": (kvp_query.textbooks.length + 3).toString()
    });
    $("body").css({
      "overflow": "hidden"
    });
    $("#img_search").attr("src", kvp_images.uri_cross);
    $("#div_imgSearchWrapper").click(function() { view_clearTextbookResults(); });
    $.each(kvp_query.textbooks, function(i, kvp_textbook) {
      var str_subtitle = "";
      if (def(kvp_textbook.str_edition)) {
        str_subtitle += kvp_textbook.str_edition;
      }
      if (def(kvp_textbook.str_edition) && def(kvp_textbook.str_isbn)) {
        str_subtitle += ", ";
      }
      if (def(kvp_textbook.str_isbn)) {
        str_subtitle += "ISBN " + kvp_textbook.str_isbn;
      }
      { $("#div_searchResultsWrapper").append(
         '<div class="div_textbook">'
        + '<div class="div_imgBookThumb"></div>'
        + '<div class="div_textbookDetailWrapper">'
        + '<p class="p_textbookTitle">'
        + kvp_textbook.str_name
        + '</p>'
        + '<p class="p_textbookSubtitle">'
        +     str_subtitle
        + '</p>'
        + '</div>'
        + '</div>'
      ); }
      $(".div_textbook").eq(i).click(function() {
        model_getTextbookContents(i);
      });
      view_formatGrayBgOnHover($(".div_textbook").eq(i));
      $(".div_textbook").eq(i).css({
        "background-color": kvp_colors.css_whiteBg,
        "border-bottom": "1px solid " + kvp_colors.css_grayLine,
        "cursor": "pointer",
        "display": "flex",
        "width": "100%"
      });
      $(".div_imgBookThumb").eq(i).css({
        "background-image": 'url("' + kvp_textbook.url_thumbnail + '")',
        "height": int_iconFrameSize.toString() + "px",
        "width": int_iconFrameSize.toString() + "px"
      });
      $(".div_textbookDetailWrapper").eq(i).css({
        "display": "flex",
        "flex-direction": "column",
        "justify-content": "center",
        "padding-left": int_iconToTextPadding.toString() + "px"
      });
      view_formatTextLarge($(".p_textbookTitle").eq(i));
      view_formatTextSmall($(".p_textbookSubtitle").eq(i));
    });
    if (kvp_query.textbooks.length == 0) {
      { $("#div_searchResultsWrapper").append(
         '<div id="div_noResults">'
        + '<div id="div_noResultsDetailWrapper">'
        + '<p id="p_noResultsSubtitle">'
        + str_noResultsSubtitle
        + '</p>'
        + '</div>'
        + '</div>'
      ); }
      $("#div_noResults").css({
        "background-color": kvp_colors.css_whiteBg,
        "border-bottom": "1px solid " + kvp_colors.css_grayLine,
        "display": "flex",
        "width": "100%"
      });
      $("#div_noResultsDetailWrapper").css({
        "display": "flex",
        "flex-direction": "column",
        "height": int_iconFrameSize.toString() + "px",
        "justify-content": "center",
        "padding-left": int_leftPadding.toString() + "px"
      });
      view_formatTextLarge($("#p_noResultsTitle"));
      view_formatTextSmall($("#p_noResultsSubtitle"));
    }
  }
  function view_pageTextbookContents() {
    view_clearTextbookResults();
    view_addTextbookSearch();
    document.title = kvp_textbook.str_name;
    var str_subtitle = "";
    if (def(kvp_textbook.str_edition)) {
      str_subtitle += kvp_textbook.str_edition;
    }
    if (def(kvp_textbook.str_edition) && def(kvp_textbook.str_isbn)) {
      str_subtitle += ", ";
    }
    if (def(kvp_textbook.str_isbn)) {
      str_subtitle += "ISBN " + kvp_textbook.str_isbn;
    }
    { $("body").append(
       '<div id="div_selectedBookBar">'
      + '<div id="div_imgSelectedBookThumb"></div>'
      + '<div id="div_selectedBookDetailWrapper">'
      + '<p id="p_selectedBookTitle">'
      + kvp_textbook.str_name
      + '</p>'
      + '<p id="p_selectedBookSubtitle">'
      + str_subtitle
      + '</p>'
      + '</div>'
      + '</div>'
    ); }
    $("#div_selectedBookBar").css({
      "background-color": kvp_colors.css_blueBg,
      "display": "flex"
    });
    $("#div_imgSelectedBookThumb").css({
      "background-image": (
        'url("' + kvp_textbook.url_thumbnail + '")'
      ),
      "height": int_iconFrameSize.toString() + "px",
      "width": int_iconFrameSize.toString() + "px"
    });
    $("#div_selectedBookDetailWrapper").css({
      "display": "flex",
      "flex-direction": "column",
      "justify-content": "center",
      "padding-left": int_iconToTextPadding.toString() + "px"
    });
    view_formatTextLarge($("#p_selectedBookTitle"));
    view_formatTextSmall($("#p_selectedBookSubtitle"));
    $.each(kvp_textbook.chapters, function(i, kvp_chapter) {
      { $("body").append(
         '<div class="div_chapter">'
        + '<p class="p_chapterName">' + kvp_chapter.str_name + '</p>'
        + '</div>'
      ); }
      $(".div_chapter").eq(i).css({
        "border-bottom": "1px solid " + kvp_colors.css_grayLine,
        "padding-bottom": "5px",
        "padding-top": "5px"
      });
      $(".p_chapterName").eq(i).css({
        "padding-bottom": "5px",
        "padding-top": "5px",
        "padding-left": int_leftPadding.toString() + "px"
      });
      view_formatTextSmall($(".p_chapterName").eq(i), true);
      $.each(kvp_chapter.sections, function(j, kvp_section) {
        var div_section = document.createElement("div"); {
          div_section.className = "div_section";
        }
        div_section.onclick = function() {
          if (kvp_textbook.chapters[i]
              .sections[j].questions.length == 0) {
            model_getQuestionsInSection(i, j);
          } else {
            view_addQuestionPageHeader();
            view_addUnaddedQuestions();
          }
        };
        { div_section.innerHTML += (
           '<p class="p_sectionNumber">'
          + kvp_section.str_number
          + '</p>'
          + '<p class="p_sectionName">'
          + kvp_section.str_name
          + '</p>'
        ); }
        var jdiv_chapter = $(".div_chapter").eq(i);
        jdiv_chapter.append(div_section);
        jdiv_chapter.find(".div_section").eq(j).css({
          "cursor": "pointer",
          "display": "flex",
          "padding-bottom": "5px",
          "padding-top": "5px",
          "padding-left": int_leftPadding.toString() + "px",
          "width": "100%"
        });
        jdiv_chapter.find(".p_sectionNumber").eq(j).css({
          "padding-right": "10px"
        });
        view_formatGrayBgOnHover(jdiv_chapter.find(".div_section").eq(j));
        view_formatTextLarge(jdiv_chapter.find(".p_sectionNumber").eq(j));
        view_formatTextSmall(jdiv_chapter.find(".p_sectionName").eq(j));
        if (!def($(".div_chapter").eq(i)
          .find(".p_sectionNumber").eq(j).text())) {
          $(".div_chapter").eq(i).find(".p_sectionNumber").eq(j)
            .text((i + 1).toString() + ".*");
        }
      });
    });
  }
  function view_addQuestionPageHeader() {
    view_addTextbookSearch();
    var str_number = "";
    if (def(kvp_textbook.chapters[int_chapter].sections[int_section]
      .str_number)) {
      str_number = (
        kvp_textbook.chapters[int_chapter].sections[int_section]
        .str_number
      );
    } else str_number = (int_chapter + 1).toString() + ".*";
    { view_addBackHeader(
      str_number, 
      kvp_textbook.chapters[int_chapter]
      .sections[int_section].str_name,
      function() {
        bool_displayQuestions = false;
        view_pageTextbookContents();
      }
    ); }
    { document.title = ("Section " + 
      kvp_textbook.chapters[int_chapter]
      .sections[int_section].str_number
    ); }
    bool_displayQuestions = true;
  }
  function view_addUnaddedQuestions() {
    { var kvps_questions = (
      kvp_textbook.chapters[int_chapter]
      .sections[int_section].questions
    ); }
    for (var i = $(".div_question").length; i < kvps_questions.length; i++) {
      if (!bool_displayQuestions) return;
      var kvp_question = kvps_questions[i];
      var div_question = document.createElement("div");
      div_question.className = "div_question";
      div_question.id = i;
      div_question.onclick = function() {
        if (bool_viewingSolution) return;
        bool_viewingSolution = true;
        bool_displayQuestions = false;
        if (kvp_textbook
          .chapters[int_chapter]
          .sections[int_section]
          .questions[parseInt(this.id)]
          .solutions.length > 0) {
          int_question = parseInt(this.id);
          view_pageSolutions();
        } else model_getSolutions(this.id);
      }
      { div_question.innerHTML += (
        '<p class="p_number">' + kvp_question.str_number + '</p>'
      ); }
      if (def(kvp_question.int_page)) {
        { $("body").append(
           '<div id=div_page' + kvp_question.int_page + '>'
          + '<p class="p_page">Page ' + kvp_question.int_page + '</p>'
          + '</div>'
        ); }
        { view_formatTextSmall(
          $("#div_page" + kvp_question.int_page)
          .find("p").eq(0)
        , true); }
        $("#div_page" + kvp_question.int_page).find("p").eq(0).css({
          "padding-top": "10px",
          "padding-bottom": "5px",
          "padding-left": int_leftPadding.toString() + "px"
        });
        if ($("body").find(".div_question").length > 1) {
          $("#div_page" + kvp_question.int_page).css({
            "border-top": "1px solid " + kvp_colors.css_grayLine,
            "margin-top": "5px"
          });
        }
      }
      document.body.appendChild(div_question);
      { div_question.innerHTML += (
        (def(kvp_question.str_answer))
        ? '<p>' + kvp_question.str_answer + '</p>'
				: '<img src=' + kvp_question.url_imgAnswer + '>'
      ); }
      view_formatTextLarge($("#" + i).find(".p_number").eq(0));
      view_formatBlueBgOnHover($("#" + i));
      $("#" + i).css({
        "cursor": "pointer",
        "display": "flex",
        "flex-direction": "row",
        "padding-bottom": "10px",
        "padding-top": "10px",
        "padding-left": int_leftPadding.toString() + "px"
      });
      $("#" + i).find("p").eq(0).css({
        "padding-right": "10px"
      });
      $("#" + i).find("img").eq(0).css({
        "padding-top": "4px"
      });
    }
  }
  function view_pageSolutions() {
    view_addTextbookSearch();
    var str_number = "";
    if (def(kvp_textbook.chapters[int_chapter].sections[int_section]
      .str_number)) {
      str_number = (
        kvp_textbook.chapters[int_chapter].sections[int_section]
        .str_number
      );
    } else str_number = (int_chapter + 1).toString() + ".*";
    { view_addBackHeader(
      kvp_textbook.chapters[int_chapter]
      .sections[int_section].questions[int_question].str_number, 
      'Section ' + str_number,
      function() {
        bool_viewingSolution = false;
        view_addQuestionPageHeader();
        view_addUnaddedQuestions();
      }
    ); }
    { document.title = (
      "Section " 
      + kvp_textbook.chapters[int_chapter]
      .sections[int_section].str_number
      + " Question "
      + kvp_textbook.chapters[int_chapter]
      .sections[int_section].questions[int_question].str_number
    ); }
    { var kvps_solutions = (
      kvp_textbook.chapters[int_chapter]
      .sections[int_section].questions[int_question].solutions
    ); }
    $.each(kvps_solutions, function(i, kvp_solution) {
      $("body").append('<div class="div_solution"></div>');
      var jdiv_solution = $(".div_solution").eq(i);
      { jdiv_solution.append(
         '<p class="p_answerer">Solution by "'
        + kvp_solution.str_answerer
        + '"</p>'
      ); }
      { view_formatTextSmall(
        jdiv_solution.find(".p_answerer").eq(0)
      , true); }
      jdiv_solution.find(".p_answerer").eq(0).css({
        "padding-top": "5px",
        "padding-bottom": "5px",
        "padding-left": int_leftPadding.toString() + "px"
      });
      $.each(kvp_solution.steps, function(j, kvp_step) {
        { jdiv_solution.append(
           '<div class="div_step">'
          + '<p class="p_stepNumber">' + (j + 1).toString() + '</p>'
          + '<div class="div_stepContent"></div>'
          + '</div>'
        ); }
        jdiv_solution.find(".div_step").eq(j).css({
          "display": "flex",
          "flex-direction": "row",
          "padding-top": "5px",
          "padding-bottom": "5px",
          "padding-left": "55px",
          "width": "100%"
        });
        jdiv_solution.find(".p_stepNumber").eq(j).css({
          "padding-right": "20px"
        });
        view_formatTextLarge(jdiv_solution.find(".p_stepNumber").eq(j));
        view_formatGrayBgOnHover(jdiv_solution.find(".div_step").eq(j));
        var jdiv_step = jdiv_solution.find(".div_stepContent").eq(j);
        if (def(kvp_step.str_explain) || def(kvp_step.url_imgExplain)) {
          { jdiv_solution.find(".div_stepContent").eq(j).append(
             '<div class="div_work"></div>'
            + '<div class="div_explain"></div>'
          ); }
          { jdiv_solution.find(".div_stepContent").eq(j).css({
            "display": "flex",
            "flex-direction": "row"
          }); }
          { jdiv_solution.find(".div_work").eq(j).css({
            "padding-right": "20px"
          }); }
          jdiv_step = jdiv_solution.find(".div_work").eq(j);
          jdiv_solution.find(".div_explain").eq(j).css({
            "max-width": (
              (
                $(window).width()
                - int_iconFrameSize
                - int_iconToTextPadding
                - jdiv_solution.find(".p_stepNumber")
                 .eq(j).width()
              ) / 2
            ).toString() + "px"
          });
          if (def(kvp_step.str_explain)) {
            jdiv_solution.find(".div_explain").eq(j).append(kvp_step.str_explain);
          } else {
            jdiv_solution.find(".div_explain").eq(j).append(
              "<img src=" + kvp_step.url_imgExplain + ">"
            );
            jdiv_solution.find(".div_explain").eq(j).find("img").eq(0).css({
              "padding-top": "4px"
            });
          }
        }
        jdiv_step.find("img").eq(0).css({
          "max-width": (
            (
              $(window).width()
              - int_iconFrameSize
              - int_iconToTextPadding
              - jdiv_solution.find(".p_stepNumber")
               .eq(j).width()
            ) / 2
          ).toString() + "px"
        });
        if (def(kvp_step.str_work)) {
          jdiv_step.append(kvp_step.str_work);
        } else {
          jdiv_step.append(
            "<img src=" + kvp_step.url_imgWork + ">"
          );
          jdiv_step.find("img").eq(0).css({
            "padding-top": "4px"
          });
        }
      });
      { $(".div_solution").eq(i).append(
         '<div class="div_answer">'
        + '<p class="p_answerNumber">*</p>'
        + '<div class="div_answerContent"></div>'
        + '</div>'
      ); }
      if (i != 0) {
        $(".div_solution").eq(i).css({
          "border-top": "1px solid " + kvp_colors.css_grayLine
        });
      }
      $(".div_solution").eq(i).css({
        "padding-bottom": "5px",
        "padding-top": "5px"
      });
      $(".div_answer").eq(i).css({
        "display": "flex",
        "flex-direction": "row",
        "padding-top": "5px",
        "padding-bottom": "5px",
        "padding-left": int_leftPadding.toString() + "px"
      });
      $(".p_answerNumber").eq(i).css({
        "padding-right": "20px"
      });
      view_formatTextLarge($(".p_answerNumber").eq(i));
      view_formatGrayBgOnHover($(".div_answer").eq(i));
      if (def(kvp_solution.str_answer)) {
        $(".div_answerContent").eq(i).append(kvp_solution.str_answer);
      } else {
        $(".div_answerContent").eq(i).append(
          '<img src="' + kvp_solution.url_imgAnswer + '">'
        );
      }
    });
  }
  function main() {
    { $("head").html("<style>\
      * {\
        margin: 0px;\
				padding: 0px;\
				font-family: Helvetica, Opens Sans, Sans-Serif;\
      }\
    </style>"); }
    $("body").css({
      "overflow-x": "hidden"
    });
    document.title = "Slader Infinite";
    clearBody();
    view_addTextbookSearch();
    $("#intext").focus();
  } main();
}
function main() {
  window.stop();
  $("html").html("<head></head><body></body>");
  var obj_sladerCrawler = new class_sladerClient();
}
console.log("Compiled");
main();