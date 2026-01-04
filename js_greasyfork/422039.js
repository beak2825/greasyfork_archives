// ==UserScript==
// @name         SUDA-HealthDailyCheck
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Health Daily Check in Soochow University
// @author       Spico
// @include      *suda/jkxxtb/jkxxcj*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/422039/SUDA-HealthDailyCheck.user.js
// @updateURL https://update.greasyfork.org/scripts/422039/SUDA-HealthDailyCheck.meta.js
// ==/UserScript==

(function () {
  'use strict';
  const vaue_tbrq = document.getElementById("vaue_tbrq")
  const checkin_form = document.querySelector(".meiri")
  let fillin_date_elem = document.createElement("div")
  fillin_date_elem.className = "form-tr clearfix"
  fillin_date_elem.innerHTML = `
    <div class="form-tr clearfix">
      <div class="form-td col-sm-6 col-xs-12">
      <div class="form-item">
        <div class="item-name" style="line-height: 17px;">自定义填报日期：</div>
          <div class="item-value">
            <div class="form-validate-2" name="tm_fillin_date" validate='{"require":false,"max":10}' mode="editable" title="自定义填报日期" maxlength="10" sui="true">
              <input name="tm_fillin_date" maxlength="30" type="text" id="tm_fillin_date" class="form-control" value="">
            </div>
          </div>
        </div>
      </div>`
  checkin_form.insertBefore(fillin_date_elem, checkin_form.firstElementChild.nextElementSibling)

  let tm_submit_button = document.createElement("button")
  tm_submit_button.className = "btn btn-primary obtn"
  tm_submit_button.setAttribute("id", "tmpost")
  tm_submit_button.innerText = "自定义提交时间的点我"
  const tpost_button = document.getElementById("tpost")
  tpost_button.parentNode.insertBefore(tm_submit_button, tpost_button)

  const tm_fillin_date = document.getElementById("tm_fillin_date")
  tm_fillin_date.value = vaue_tbrq.innerText
  tm_fillin_date.addEventListener("change", (e) => {
    tbrq = tm_fillin_date.value
    vaue_tbrq.innerText = tm_fillin_date.value
  })

  tm_submit_button.addEventListener("click", (e) => {
    $('#tmpost').attr('disabled', true);
    if (finished) {
      $('#tmpost').removeAttr('disabled');
      return;
    }

    let date = new Date()
    var nowTime = tm_fillin_date.value + ` ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    var maxTime = nowTime.substring(0, 10) + " 13:00:00";
    var nowRq = nowTime.substring(0, 10);
    if (nowRq != tbrq) {
      layer.alert("填报日期已过时，请刷新！");
      $('#tmpost').removeAttr('disabled');
      return;
    }

    var suiForm = $(".sui-form").sui();
    if (!$(".sui-form")[0].zoo.validate()) {
      let mflag = true;
      $('.meiri div[class^=sui-]').each(function () {
        if (!$(this)[0].zoo.validate()) {
          mflag = false;
        }
      })

      let zflag = true;
      $('.jiben div[class^=sui-]').each(function () {
        if (!$(this)[0].zoo.validate()) {
          zflag = false;
        }
      })

      if (!mflag) {
        layer.alert("请完善每日打卡信息！");
      } else if (!zflag) {
        layer.alert("请完善基本信息！");
      }

      $('#tmpost').removeAttr('disabled');
      return;
    } else {
      let mflag = true;
      $('.meiri div[class^=sui-]').each(function () {
        if (!$(this)[0].zoo.validate()) {
          mflag = false;
        }
      })

      let zflag = true;
      $('.jiben div[class^=sui-]').each(function () {
        if (!$(this)[0].zoo.validate()) {
          zflag = false;
        }
      })

      if (!mflag) {
        layer.alert("请完善每日打卡信息！");
        $('#tmpost').removeAttr('disabled');
        return;
      } else if (!zflag) {
        layer.alert("请完善基本信息！");
        $('#tmpost').removeAttr('disabled');
        return;
      }
    }

    let entity = suiForm.getValue();
    entity.tjsj = nowTime.substring(0, 16);
    if (entity.jtdzshen == "省份" || entity.jtdzshi == "地级市") {
      layer.alert("请完善具体地址信息！");
      $('#tmpost').removeAttr('disabled');
      return;
    }
    if (entity.jgshen == "省份" || entity.jgshi == "地级市") {
      layer.alert("请完善籍贯信息！");
      $('#tmpost').removeAttr('disabled');
      return;
    }

    entity.jkzk = JSON.stringify(entity.jkzk);
    entity.dlqk = JSON.stringify(entity.dlqk);
    entity.tbrq = tbrq;

    if (entity.sfyxglz == "否") {
      entity.glfs = "";
    }

    //返校时间
    if (entity.xrywz == 2) {	//本次填报在苏州，则查询上次返校时间，如果有值则返回上一次返校时间，如果无值则判断上一次的人员位置
      queryNearTb();
      if (!(sfxsj == "" || sfxsj == null)) {
        entity.fxsj = sfxsj;
      } else if (sxrywz == 2) {
        entity.fxsj = stbrq;
      } else {
        entity.fxsj = "";
      }
    } else {
      entity.fxsj = "";
    }

    //预警状态
    let yjzt = 0;
    if (entity.jkzk == '["1"]') {	//健康状况正常，不预警
      yjzt = 0;
    } else if ((entity.jkzk.indexOf('"9"') != -1) || (entity.jkzk.indexOf('"10"') != -1)) {	//疑似、确诊预警状态为1
      yjzt = 1;
    } else {
      //判断当天
      if (entity.xrywz > 5 || entity.xrywz == 3) {
        yjzt = 1;
      } else if (entity.dlqk != '["1"]') {
        yjzt = 1;
      } else {
        let tw = queryTw();
        if (tw != "" && entity.jrtw != "" && entity.jrtw != null && parseFloat(entity.jrtw) > parseFloat(tw)) {
          yjzt = 1;
        } else {
          let dd = queryDd();
          if (dd.indexOf(entity.jtdzshi) != -1) {
            yjzt = 1;
          } else {
            let sflag = querySstsj();
            //十四天内有数据,则预警状态为1，否则为2
            if (sflag) {
              yjzt = 1;
            } else {
              yjzt = 2;
            }
          }
        }
      }
    }
    entity.yjzt = yjzt;
    entity.__type = "sdo:com.sudytech.work.suda.jkxxtb.jkxxtb.TSudaJkxxtb";
    if (entity.id == "" || entity.id == null || flag == false) {
      delete entity.id;
    }
    $.ajax({
      url: 'com.sudytech.portalone.base.db.saveOrUpdate.biz.ext',
      type: 'post',
      async: false,
      data: wf.jsonString({
        entity: entity
      }),
      contentType: "text/json",
      success: function (data) {
        if (data.exception) {
          layer.alert('提交失败！');
          $('#tmpost').attr('disabled', true);
        } else {
          $('#tmpost').attr('disabled', true);

          let tipText = "提交成功！";
          if (entity.xrywz == "1" && (parseFloat(entity.swtw) > 37.3 || parseFloat(entity.xwtw) > 37.3 || entity.jkzk.indexOf("1") == -1)) {
            tipText = "提交成功！您状况异常，请联系校医院，电话：xxxxxx。";
          }
          layer.alert(tipText, { icon: 1, title: '提示', closeBtn: 0 }, function () {
            layer.closeAll();
            window.location.href = "dkjl.jsp";
          });
        }
      },
      error: function () {
        layer.alert('提交失败！');
        $('#tmpost').attr('disabled', true);
      }
    });
  });

})();