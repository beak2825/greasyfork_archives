// ==UserScript==
// @name         头歌复制助手 Educoder Copy Helper
// @namespace    https://github.com/lcandy2/user.js/tree/main/websites/educoder.net/educoder-copy-helper
// @version      2.8
// @author       甜檸Cirtron (lcandy2)
// @description  📝解除头歌复制粘贴限制，解除头哥复制缩短限制，支持考试；✨与《头歌助手 EduCoder Helper》搭配使用解锁“一键复制”、“一键全部文件复制”、“导出全部文件”等功能。🧹大小仅1.82KB，极小尺寸，无需任何权限，无需任何配置，安装即用。💛安全开源可读，无论是编译前后的代码均保持开源和易读性，防止窃取其他信息
// @license      AGPL-3.0-or-later
// @copyright    lcandy2 All Rights Reserved
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAABsUlEQVR4nO2ZzUrDQBCAA3kM23NfJKuC4FW6vYjZV/DiK7SaeCxYKiRQE5qNB7EPUoT6A3op9GBFi5eeIhsMjNbW2s2apMwHc2t35tud3RxG0xTQ6IRlyw26thtMRFgu55ZzWdGKQKMTlm2Hj22XR1/C4eNTJyhpeceKdz4u+ur43N8QRdtOcP0p4Wt5x47bhkdwt+NTcXlkucFbJkVt7u2XCTW7RpVNCGVREjNtAuLopLmT/P/Qau4u+i0Ba4ocBmXhVu2gklrxBmVjmGQZgXr7YiokRPH1tj9dVoAkItR8EbmlBcTO/5TgN4G/BJmzPqFM/s7Atrm5fYggaQlA+oN72E7ydwbuyHfOeE+6+BbvzawLcyoVeByOpCRavBc9DUfZCaiCoAAAT2AFCLbQki2ke+9SkfkJoMAc8A5A8BldAYLPKABfIS/H3wFVEBRQdAdydwJ60QVUQVAAgN8BD78Dcqz1JdaL/ozqRRdQBUEBAJ5A1i1kgAGHGD6opj+4AwLmq7wAZeGCEZDiMD1pATEtFAO3fy++yp63a6yU4piV+WJmpbpwI85heqkVjyBrzgdOSyKlYdgYdgAAAABJRU5ErkJggg==
// @homepage     https://greasyfork.org/scripts/495490
// @homepageURL  https://greasyfork.org/scripts/495490
// @source       https://github.com/lcandy2/user.js/tree/main/websites/educoder.net/educoder-copy-helper
// @match        *://www.educoder.net/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/495490/%E5%A4%B4%E6%AD%8C%E5%A4%8D%E5%88%B6%E5%8A%A9%E6%89%8B%20Educoder%20Copy%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/495490/%E5%A4%B4%E6%AD%8C%E5%A4%8D%E5%88%B6%E5%8A%A9%E6%89%8B%20Educoder%20Copy%20Helper.meta.js
// ==/UserScript==

(function () {
  'use strict';

  async function saveTaskJson(request, response) {
    try {
      const signature = request.headers.get("X-EDU-Signature");
      if (signature) {
        window.xEduSignature = signature;
      }
      const timestamp = request.headers.get("X-EDU-Timestamp");
      if (timestamp) {
        window.xEduTimestamp = timestamp;
      }
      const type = request.headers.get("X-EDU-Type");
      if (type) {
        window.xEduType = type;
      }
    } catch (e) {
      console.error("[educoder-copy-helper] Error reading request headers:", e);
    }
    const res = response.clone();
    if (request.url.includes("/api/tasks") || request.url.includes("json?homework_common_id")) {
      try {
        const json = await res.json();
        console.debug(`[educoder-copy-helper] [RESPONSE] ${request.url.toString()}`, json);
        if (json && json.challenge && json.challenge.path) {
          const path = json.challenge.path;
          window.taskChallengePath = path;
        }
      } catch (e) {
        console.error("[educoder-copy-helper] Error reading response body:", e);
      }
    }
    if (request.url.includes("watch_video_histories.json")) {
      try {
        const reqJson = await request.json();
        const resJson = await res.json();
        console.debug(`[educoder-copy-helper] [REQUEST] ${request.url.toString()}`, reqJson);
        console.debug(`[educoder-copy-helper] [RESPONSE] ${request.url.toString()}`, resJson);
        if (reqJson && reqJson.video_id) {
          window.videoId = reqJson.video_id;
        }
        if (resJson && resJson.log_id) {
          window.videoLogId = resJson.log_id;
        }
      } catch (e) {
        console.error("[educoder-copy-helper] Error reading response body:", e);
      }
    }
    if (request.url.includes("rep_content.json")) {
      try {
        const url = new URL(request.url);
        const pathSegments = url.pathname.split("/");
        const taskId = pathSegments[pathSegments.length - 2];
        console.debug(`[educoder-copy-helper] [RESPONSE] ${request.url.toString()}`, taskId);
        if (taskId) {
          window.taskId = taskId;
        }
      } catch (e) {
        console.error("[educoder-copy-helper] Error reading response body:", e);
      }
    }
  }
  async function modifyTaskCopy(request, response) {
    let res = response.clone();
    res = await modifyTask(request, res);
    res = await modifyExercise(request, res);
    return res;
  }
  const modifyTask = async (request, response) => {
    if (request.url.includes("/api/tasks") || request.url.includes("json?homework_common_id")) {
      const res = response.clone();
      try {
        const json = await res.json();
        if (json) {
          if (json.shixun) {
            !json.shixun.forbid_copy && (json.shixun.name = `${json.shixun.name} （已允许复制粘贴）`);
            json.shixun.can_copy = true;
            json.shixun.vip = true;
            json.shixun.forbid_copy = false;
            json.shixun.copy_for_exercise = true;
            json.shixun.active_copy = true;
            json.shixun.copy_for_exercise_save = true;
            json.shixun.allow_file_upload = true;
            json.shixun.open_local_evaluate = true;
            json.shixun.open_self_run = true;
            json.shixun.code_edit_permission = true;
          }
          if (json.challenge) {
            json.challenge.diasble_copy = false;
          }
          if (OTHER_MODIFY)
            ;
        }
        return new Response(JSON.stringify(json), {
          status: response.status,
          statusText: response.statusText,
          headers: response.headers
        });
      } catch (e) {
        console.error("Error reading response body:", e);
        return response;
      }
    }
    return response;
  };
  const modifyExercise = async (request, response) => {
    const modifyExerciseSetting = (json) => {
      json.is_random = false;
      json.screen_open = false;
      json.screen_num = 0;
      json.screen_sec = 0;
      json.ip_limit = "no";
      json.ip_bind = false;
      json.ip_bind_type = false;
      json.question_random = false;
      json.choice_random = false;
      json.check_camera = false;
      json.open_phone_video_recording = false;
      json.forbid_screen = false;
      json.use_white_list = false;
      json.net_limit = false;
      json.net_limit_list = null;
      json.only_on_client = false;
      json.open_camera = false;
      json.is_locked = false;
      json.identity_verify = false;
      json.open_appraise = true;
      json.score_open = 0;
      json.answer_open = true;
      json.open_score = 0;
      json.open_total_score = 0;
      json.screen_shot_open = false;
    };
    if (request.url.includes("/api/exercises") && request.url.includes("get_exercise_user_info.json")) {
      const res = response.clone();
      try {
        const json = await res.json();
        if (json) {
          if (json.data) {
            modifyExerciseSetting(json.data);
          }
        }
        return new Response(JSON.stringify(json), {
          status: response.status,
          statusText: response.statusText,
          headers: response.headers
        });
      } catch (e) {
        console.error("Error reading response body:", e);
        return response;
      }
    }
    if (request.url.includes("/api/exercises") && (request.url.includes("start.json") || request.url.includes("exercise_setting.json"))) {
      const res = response.clone();
      try {
        const json = await res.json();
        if (json) {
          if (json.exercise) {
            modifyExerciseSetting(json.exercise);
          }
        }
        return new Response(JSON.stringify(json), {
          status: response.status,
          statusText: response.statusText,
          headers: response.headers
        });
      } catch (e) {
        console.error("Error reading response body:", e);
        return response;
      }
    }
    return response;
  };
  function hookFetch() {
    const nativeFetch = window.fetch;
    const hookedFetch = async (...args) => {
      const request = new Request(...args);
      const response = await nativeFetch(...args);
      const clonedResponse = response.clone();
      await saveTaskJson(request, clonedResponse);
      const modifiedResponse = await modifyTaskCopy(request, clonedResponse);
      return modifiedResponse;
    };
    window.fetch = hookedFetch;
  }
  const OTHER_MODIFY = false;
  hookFetch();
  window.educoderCopyHelper = "2.8";

})();