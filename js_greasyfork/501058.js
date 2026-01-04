// ==UserScript==
// @name         零代码发布
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  零代码发布用
// @match        http://matrix.cfuture.shop/matrix/*
// @match        https://matrix.cfuture.shop/matrix/*
// @author       You
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cfuture.shop
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/501058/%E9%9B%B6%E4%BB%A3%E7%A0%81%E5%8F%91%E5%B8%83.user.js
// @updateURL https://update.greasyfork.org/scripts/501058/%E9%9B%B6%E4%BB%A3%E7%A0%81%E5%8F%91%E5%B8%83.meta.js
// ==/UserScript==

// 监听接口（xhr）
function addXMLRequestCallback(callback) {
  const open = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function () {
    this.addEventListener('load', function () {
      callback({
        responseURL: this.responseURL,
        responseText: this.responseText,
        status: this.status,
      })
    });
    open.apply(this, arguments);
  };
}

(function () {
  'use strict';
  // 防止重复请求
  let published = true;

  /** 部署 nocodeAdmin */
  async function deployNocodeAdmin() {
    if (published) {
      return;
    }
    // 获取部署状态
    const nocodeAdminRes = await fetch('http://matrix.cfuture.shop/v2/releaseManage/deploy/getActiveDeployInfo?pipelineCode=fe_hmos_nocode_admin_test_defaultPipeline', {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
      }
    }).then(res => res?.json());
    const { metadata, pipelineInfo, branchInfo } = nocodeAdminRes?.data || {};
    console.log('data====', metadata, pipelineInfo, branchInfo, nocodeAdminRes?.data)

    // 只有非进行中才重新部署
    if (['Failed', 'Success'].includes(pipelineInfo?.instance?.status)) {
      console.log('开始部署 nodecodeAdmin');
      published = true;
      fetch('http://matrix.cfuture.shop/v2/releaseManage/deploy/reCommit', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        }, body: JSON.stringify({ id: metadata?.id, features: branchInfo?.features })
      }).then(() => {
        published = true;
      })
    }
  };

  addXMLRequestCallback(function (xhr) {
    // 找到获取部署状态接口
    if (['http://matrix.cfuture.shop/v1/releaseManage/deploy/getActiveDeployInfo?pipelineCode=%40cffe%2Fhmos-zero-code-material_test_defaultPipeline', 'http://matrix.cfuture.shop/v1/releaseManage/deploy/getActiveDeployInfo?pipelineCode=%40cffe%2Ffe-zero-code-solution_test_defaultPipeline'].includes(xhr.responseURL)) {
      const response = JSON.parse(xhr.responseText || '{}');
      const deployStatus = response?.data?.status?.deployStatus;
      // 部署完成 (error：失败 process：进行中)
      if (deployStatus === 'finish' && !published) {
        deployNocodeAdmin();
      }
      if (['error', 'process'].includes(deployStatus)) {
        published = false;
      }
    }
  });

  console.log('开始监听部署状态');
})();