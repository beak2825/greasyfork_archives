// ==UserScript==
// @name         尺寸自动计算
// @namespace    http://www.51siny.com/
// @version      0.1
// @description  根据我自己的公式快速计算结果,主要是方便在多个设备间切换使用，自己用
// @require   https://cdn.bootcss.com/jquery/3.2.1/jquery.min.js
// @author       写代码的猫叔
// @license      MIT
// @match        https://www.51siny.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/433883/%E5%B0%BA%E5%AF%B8%E8%87%AA%E5%8A%A8%E8%AE%A1%E7%AE%97.user.js
// @updateURL https://update.greasyfork.org/scripts/433883/%E5%B0%BA%E5%AF%B8%E8%87%AA%E5%8A%A8%E8%AE%A1%E7%AE%97.meta.js
// ==/UserScript==

(function() {
  'use strict';
  document.title="尺寸自动计算"
  let H=`
  <style>
  .m_mainbox{
    padding:20px;
  }
    .m_mainbox .s_ipt{
      padding:8px;
      border:1px solid #ddd;
      border-radius:5px;
      width:60px;
    }

    .m_mainbox .btm{
      border:1px solid #ddd;
      background:#fff;
      border-radius:10px;
      padding:10px;
      font-size:20px;
      margin-top:20px;
    }
    .m_mainbox .btm p{
      font-weight:bold;
      margin:15px 3px 3px 3px
    }

    .btm_table th{
      background:#ddd
    }
    .btm_table th,.btm_table td{
      padding:6px 10px;
    }
  </style>


  <div class="m_mainbox">
    <h3 style="margin-bottom:10px;">尺寸自动计算</h3>
    输入H：<input type="number" class="s_ipt ipt_w"/>
    输入L：<input type="number" class="s_ipt ipt_h"/>
    <div class="btm">
      <p>内外框：</p>
      <div style="display: flex;
      justify-content: flex-start;
      align-items: center; margin-bottom:10px">
        <div class="s_H" style="margin-right:10px;">
        高为：<span></span>
        </div>
        <div class="s_L">
        宽为：<span></span>
        </div>
      </div>
            
      <table class="btm_table" border="2"  cellspacing="0" cellpadding="0">
        <tr>
          <th>项目</th>
          <th>三推</th>
          <th>两推</th>
        </tr>
      
        <tr>
          <td>
          内扇宽：
          </td>
          <td>            
            <div class="W">
              <span></span>
            </div>
          </td>
          <td>
            <div class="W">
              <span></span>
            </div>
          </td>
        </tr>

        <tr>
          <td>
            内扇高：
          </td>
          <td>            
            <div class="H1">
              <span></span>
            </div>
          </td>
          <td>
            <div class="H2">
              <span></span>
            </div>
          </td>
        </tr>

        <tr>
          <td>
            划线：
          </td>
          <td>            
            <div class="HX1">
              <span></span>
            </div>
          </td>
          <td>
            <div class="HX2">
              <span></span>
            </div>
          </td>
        </tr>

        <tr>
          <td>
          纱内扇：
          </td>
          <td>            
            <div class="sns1">
              <span></span>
            </div>
          </td>
          <td>
            <div class="sns2">
              <span></span>
            </div>
          </td>
        </tr>

        <tr>
          <td>
          外框纱：
          </td>
          <td>            
            <div class="wks1">
              <span></span>
            </div>
          </td>
          <td>
            <div class="wks2">
              <span></span>
            </div>
          </td>
        </tr>


      </table>


    </div>
  </div>
  
  `
   function jisuan(H,L) {
     
     let L1=L-37+9
        L1 = num(L1)
     $('.m_mainbox .W span').text(L1)

     let HH = H-37+63
     let H1=HH/3
     let H1_2=(H-37)/2+15
     H1 = num(H1)

     H1_2 = num(H1_2)
      $('.m_mainbox .s_H span').text(num(H-37))
      $('.m_mainbox .s_L span').text(num(L-37))

      $('.m_mainbox .H1 span').text(H1)
      $('.m_mainbox .H2 span').text(H1_2)

      // 划线     
      $('.m_mainbox .HX1 span').text(num(H1-16))
      $('.m_mainbox .HX2 span').text(num(H1_2-18))

      // 纱内扇
      $('.m_mainbox .sns1 span').text('高：'+num(H1-45)+'，宽：'+num(L1-45))
      $('.m_mainbox .sns2 span').text('高：'+num(H1_2-45)+'，宽：'+num(L1-45))

      // 外框纱
      $('.m_mainbox .wks1 span').text('高：'+num(H1-14)+'，宽：'+num(L1+8))
      $('.m_mainbox .wks2 span').text('高：'+num(H1_2-14)+'，宽：'+num(L1+8))



   }

   function num(e) {
     console.log('e: ', e);
     const s = e
      return Number(parseInt(s))
      // return Number(parseFloat(s).toFixed(2))
   }

   $(document).on('keyup','.m_mainbox .ipt_w,.m_mainbox .ipt_h',function(){
    let w = $('.m_mainbox .ipt_w').val()
    let h = $('.m_mainbox .ipt_h').val()
    console.log('w: ', w,h);

    if(!!w && !!h){
      jisuan(w,h)
    }
   })
  $('body').html(H)
})();
