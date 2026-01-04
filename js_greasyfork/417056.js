// ==UserScript==
// @name               中大自动评教
// @name:en            SYSU Auto Evaluation
// @name:zh            中大自动评教
// @namespace          https://github.com/KumaTea
// @namespace          https://greasyfork.org/en/users/169784-kumatea
// @version            0.2.1.0
// @description        中山大学教务系统学生自动评教脚本
// @description:en     Automatic Script for Student Evaluation from Academic Affairs System of Sun Yat-sen University
// @description:zh     中山大学教务系统学生自动评教脚本
// @description:zh-cn  中山大学教务系统学生自动评教脚本
// @author             KumaTea
// @match              https://jwxt.sysu.edu.cn/jwxt/mk/evaluation/
// @require            https://unpkg.com/sweetalert@2.1.2/dist/sweetalert.min.js
// @license            MIT
// @downloadURL https://update.greasyfork.org/scripts/417056/%E4%B8%AD%E5%A4%A7%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99.user.js
// @updateURL https://update.greasyfork.org/scripts/417056/%E4%B8%AD%E5%A4%A7%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99.meta.js
// ==/UserScript==

/* jshint esversion: 8 */


let item = 0; // Evaluation block index
let delay = 2000; // 延迟2秒，过短易出错
let times; // 获取新项目频次
let finish; // Finishing alert
let repeat; // 总评教次数
let good_rate = 1; // 评优率，默认100%，请设置于[0,1]区间


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


function react_input(component, value) {
  // Credit: https://github.com/facebook/react/issues/11488#issuecomment-347775628
  let last_value = component.value;
  component.value = value;
  let event = new Event('input', {bubbles: true});
  // React 15
  event.simulated = true;
  // React 16
  let tracker = component._valueTracker;
  if (tracker) {
    tracker.setValue(last_value);
  }
  component.dispatchEvent(event);
}


async function autoEval() {
  for (repeat = 0; repeat < 5; repeat++) {
    for (times = 0; times < 10; times++) {

      await sleep(delay);

      if (document.querySelector('.stu-eva-con').querySelectorAll('.sys-card')[item])
        // Select an evaluation block

      {
        document.querySelector('.stu-eva-con').querySelectorAll('.sys-card')[item].querySelector('button').click();
      }
      // Click the start button

      else {
        break;
      }
      // No available evaluation block, exit the function

      await sleep(delay);

      let table_rows = document.querySelectorAll('.ant-table-wrapper')[1].querySelector('.ant-table-tbody').querySelectorAll('.ant-table-row');
      for (let i = 0; i < table_rows.length; i++) {
        let table_column = table_rows[i].querySelectorAll('td');
        react_input(table_rows[i].querySelector('input.ant-input'),
          Math.round(good_rate * parseInt(table_column[table_column.length - 2].textContent)));
      }
      // Click all option refer to good evaluating rate

      await sleep(delay);

      document.querySelector('.ant-modal-footer').querySelector('.ant-btn-primary').click();
      // Click submit button

      await sleep(delay);

      let captcha = true;
      let block_img;
      try {
        block_img = document.querySelector('.ant-modal-body').querySelectorAll('img');
      } catch (e) {
        block_img = [];
        captcha = false;
      }
      while (captcha) {
        if (block_img.length > 0) {
          if (block_img[block_img.length - 1].alt === "验证码") {
            sweetAlert("请手动输入验证码，然后稍作等待。", {buttons: false, timer: 3000,});
          } else {
            captcha = false;
            break;
          }
        } else {
          captcha = false;
          break;
        }

        await sleep(delay * 5);

        try {
          document.querySelector('.ant-modal-footer').querySelector('.ant-btn-primary').click();
          // Submit again
        } catch (e) {
          void (0);
          // Do nothing: user have clicked
        }
        await sleep(delay);
        try {
          block_img = document.querySelector('.ant-modal-body').querySelectorAll('img');
        } catch (e) {
          block_img = [];
          captcha = false;
        }
      }
      // Detect if manually input captcha is needed

      if (document.querySelector('.ant-modal-close') != null) {
        document.querySelector('.ant-modal-close').click();
        item++;
      }
      // Count if evaluation failed
    }

    document.querySelector('.stu-eva-con').querySelector('.stu-eva-more').querySelector('i').click();
    // Click get more
  }

  if (item > 0) {
    finish = "评教完成。\n共" + item + "次无法评价。";
  } else {
    finish = "评教已顺利完成。";
  }
}


autoEval().then(r => {sweetAlert(finish);});
