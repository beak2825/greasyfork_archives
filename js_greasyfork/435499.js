// ==UserScript==
// @name         上海开放大学-在线学习平台学历作业一网打尽
// @namespace    ydsuper.com
// @version      2.0.0
// @description  单选题多选题判断题一网打尽
// @author       YDSUPER
// @match        https://l.shou.org.cn/study/assignment/*
// @license      GPL License
// @charset      UTF-8
// @downloadURL https://update.greasyfork.org/scripts/435499/%E4%B8%8A%E6%B5%B7%E5%BC%80%E6%94%BE%E5%A4%A7%E5%AD%A6-%E5%9C%A8%E7%BA%BF%E5%AD%A6%E4%B9%A0%E5%B9%B3%E5%8F%B0%E5%AD%A6%E5%8E%86%E4%BD%9C%E4%B8%9A%E4%B8%80%E7%BD%91%E6%89%93%E5%B0%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/435499/%E4%B8%8A%E6%B5%B7%E5%BC%80%E6%94%BE%E5%A4%A7%E5%AD%A6-%E5%9C%A8%E7%BA%BF%E5%AD%A6%E4%B9%A0%E5%B9%B3%E5%8F%B0%E5%AD%A6%E5%8E%86%E4%BD%9C%E4%B8%9A%E4%B8%80%E7%BD%91%E6%89%93%E5%B0%BD.meta.js
// ==/UserScript==

const YDSUPER = `<div id="ydsuper">
<p class="tip">嵌入成功！点击下方按钮开始👇</p>
<p><input class="delayIpt" type="text" placeholder="修改延迟（默认150, 单位ms）"><i class="delayTip">ℹ</i></p>
<button class="btn">开启</button>
<p class="desc">准备中</p>
</div>`
const STYLE = `<style>
#ydsuper {
  z-index: 999999999;
  position: fixed;
  top: 100px;
  left: 40px;
  text-align: center;
  font-weight: bold;
  padding: 16px;
  padding-bottom: 0;
  background-color: #c4cbcf;
  border-radius: 6%;
}
#ydsuper .tip {
  background-color: gold;
}
#ydsuper .btn {
  width: 100px;
  padding: 8px;
  color: #fff;
  background-color: #2486b9;
  outline-style: none;
  border: none;
  cursor: pointer;
}
#ydsuper .btn:active {
  background-color: #126bae;
}
#ydsuper .desc {
  font-size: 14px;
}
#ydsuper .delayIpt {
  width: 90%;
  border: 1px solid #222;
}
#ydsuper .delayIpt:focus {
  border: 1px solid #000;
  background-color: #f1f0ed;
}
#ydsuper .delayTip {
  display: inline-block;
  width: 14px;
  height: 14px;
  line-height: 14px;
  border-radius: 50%;
  border: 1px solid #000;
  font-style: normal;
  font-size: 12px;
  cursor: pointer;
  margin-left: 6px;
  vertical-align: middle;
}
</style>`
$('head').append(STYLE)
$('body').append(YDSUPER)
$('#ydsuper .btn').click(runLoading)
$('#ydsuper .delayTip').click(handleDelayTip)
$('#ydsuper .delayIpt').on('change', changeDelayIpt)

const DELAYDEFAULT = 150;
let delayNew = null;

function changeDelayIpt() {
  const val = parseInt($(this).val());
  console.log('val', val);
  if (isNaN(val)) {
    $(this).val('')
    return delayNew = null
  }
  delayNew = val;
  console.log('delay', delayNew);
}
function handleDelayTip() {
  alert(`此延迟为每题自动作答延迟<br/>可根据网络环境修改延迟, 推荐范围150-300, 单位为毫秒(ms)<br/>如: 最终得分临近满分, 此原因可能是网络环境不稳定, 建议修改为更大的延迟`)
}

function runLoading() {
  $('.desc').text('耐心等待...')
  setTimeout(() => {
    run()
    $('.desc').text('执行完毕，可直接提交')
  }, 0)
}

function run() {
  let tipFlag2 = localStorage.getItem('tipFlag2');
  if (!tipFlag2) {
    alert(`【PS：如遇问题请重新尝试】</p>`)
    localStorage.setItem('tipFlag2', true);
  }
  var options = ["0,1,2,3,4", "1,2,3,4", "0,2,3,4", "0,1,3,4", "0,1,2,4", "0,1,2,3", "0,1,2", "0,1,3", "0,1,4", "0,2,3", "0,2,4", "0,3,4", "1,2,3", "1,2,4", "1,3,4", "2,3,4", "0,1", "0,2", "0,3", "0,4", "1,2", "1,3", "1,4", "2,3", "2,4", "3,4", "0", "1", "2", "3", "4"];
  let answerList = [];
  let answerList2 = [];
  $("form").each(function () {
    var f = $(this);
    if (f.parent().data("questiontype") == "1") {
      for (var i = 0; i <= 4; i++) {
        $.ajax({
          type: "post",
          url: "/study/ajax-assignment-online_homework_answer",
          data: "studentWorkId=" + f.children('[name $= WorkId]').val() + "&answer=" + i + "&online=1",
          async: false,
          dataType: "json",
          success: function (data) {
            if (data.isRight == 1) {
              var lis = f.children(".e-q").children().children().children(".e-q-quest").children(".e-a-g").children();
              $(lis).children().each(function () {
                if ($(this).data("index") == i + "") {
                  f.children("[name=answer]").val(i);
                  handleClick(this);
                }
              })
            }
          }
        });
      }
    } else if (f.parent().data("questiontype") == "2") {
      for (var i = 0; i <= options.length; i++) {
        $.ajax({
          type: "post",
          url: "/study/ajax-assignment-online_homework_answer",
          data: "studentWorkId=" + f.children('[name $= WorkId]').val() + "&answer=" + options[i] + "&online=1",
          async: false,
          dataType: "json",
          success: function (data) {
            if (data.isRight == 1) {
              var lis = f.children(".e-q").children().children().children(".e-q-quest").children(".e-a-g").children();
              var sp = (options[i] + "").split(",");
              for (var a = 0; a < sp.length; a++) {
                $(lis).children().each(function () {
                  if ($(this).data("index") == sp[a] + "") {
                    f.children("[name=answer]").val(i);
                    $(this).css({ color: "red" });
                    answerList2.push(this);
                  }
                })
              }
            }
          }
        });
      }
    } else if (f.parent().data("questiontype") == "3") {
      for (var i = 0; i <= 2; i++) {
        $.ajax({
          type: "post",
          url: "/study/ajax-assignment-online_homework_answer",
          data: "studentWorkId=" + f.children('[name $= WorkId]').val() + "&answer=" + i + "&online=1" + "&HomeWorkUniqueFlag=qhgcav2s67tkgdzivxv-zg",
          async: false,
          dataType: "json",
          success: function (data) {
            if (data.isRight == 1) {
              var lis = f.children(".e-q").children().children().children(".e-q-quest").children(".e-a-g").children();
              $(lis).children().each(function () {
                if ($(this).data("index") == i + "") {
                  f.children("[name=answer]").val(i);
                  handleClick(this);
                }
              })
            }
          }
        });
      }
    }

  })

  function handleClick($this) {
    let dataId = $($this).parents('form').parent().data('id');
    $(`.e-select-g a[data-id = ${dataId}]`).attr('aria-checked', true).addClass('active');
    $($this).css({ color: "red" });
    $($this).addClass('checked');
    answerList.push($this);
  }

  // $.each(answerList, function (i, item) {
  //     $(item).trigger("click");
  // })

  function answerListEach() {
    $.each(answerList, function (i, item) {
      $(item).trigger("click");
    })
  }

  if (answerList2.length > 0) {
    setTimeout(function () {
      multiSelectClick(0, answerList2);
    }, 4000);
  } else {
    answerListEach();
  }

  function multiSelectClick(n, ele) {
    if (n < ele.length) {
      $(ele[n]).trigger("click");
      setTimeout(function () {
        multiSelectClick(n + 1, ele);
      }, delayNew || DELAYDEFAULT);
    } else {
      answerListEach();
      return;
    }
  }
}