// ==UserScript==
// @name         Teamshare 开发环境全局变量
// @description  端口 3000
// @namespace    http://tampermonkey.net/
// @version      0.0.3
// @author       陈梓聪
// @match        http://localhost:3000/*
// @run-at       document-start
// @icon         https://teamshare.kkguan.com/favicon.svg
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/500543/Teamshare%20%E5%BC%80%E5%8F%91%E7%8E%AF%E5%A2%83%E5%85%A8%E5%B1%80%E5%8F%98%E9%87%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/500543/Teamshare%20%E5%BC%80%E5%8F%91%E7%8E%AF%E5%A2%83%E5%85%A8%E5%B1%80%E5%8F%98%E9%87%8F.meta.js
// ==/UserScript==

;(function () {
  const others = {
    ORGANIZATION: {
      HIDE_CREATION: true,
    },
    COPYRIGHT: {
      COMPANY_URL: 'teamshare.kkguan.com',
      COMPANY_TEXT: 'Teamshare',
      ICP_URL: 'https://beian.miit.gov.cn',
      ICP_TEXT: '粤ICP备2023088718号',
      PUBLIC_SECURITY_URL: '',
      PUBLIC_SECURITY_TEXT: '',
    },
  }

  window.CONFIG = {
    // 应用当前环境
    APP_ENV: 'dev',

    // 钉钉免登录 CorpId
    DING_TALK_CORP_ID: 'ding46d82d5da2d06a79a39a90f97fcb1e09',

    // 控制台服务端地址
    KEEWOOD_SERVICE_URL: 'https://keewood-v2-service.t.cn-shenzhen.aliyun.kkgroup.work',

    // 控制台访问地址
    KEEWOOD_WEB_URL: 'https://keewood-v2-web-test.t.cn-shenzhen.aliyun.kkgroup.work',

    // 钉钉扫码登录 ClientId
    SSO_DING_TALK_APP_KEY: 'dingttozvuadznlvb3t5',

    // 钉钉静默登录 CorpId
    SSO_DING_TALK_CORP_ID: 'ding46d82d5da2d06a79a39a90f97fcb1e09',
    SSO_HOST: 'https://sso-t.kkguan.com',
    TEAMSHARE_APP_TAG: '',
    TEAMSHARE_APP_VERSION: '',

    // 云文档内上传文件大小控制
    TEAMSHARE_CLOUDDOC_UPLOAD_MAX_SIZE: '10',

    // 云文档服务地址
    TEAMSHARE_DOCS_SERVICE: 'https://teamshare-docs-service.t.cn-shenzhen.aliyun.kkgroup.work',

    // 云文档 Socket 地址
    TEAMSHARE_DOCS_SOCKET: 'wss://teamshare-docs-service.t.cn-shenzhen.aliyun.kkgroup.work',

    // 新云文档服务地址
    TEAMSHARE_DOCX_SERVICE: 'https://teamshare-document.t.cn-shenzhen.aliyun.kkgroup.work',

    // 云文档服务端 Socket 地址
    TEAMSHARE_DOCX_SOCKET: 'wss://teamshare-document-service.t.cn-shenzhen.aliyun.kkgroup.work/ws',
    TEAMSHARE_ENV: 'development',

    // 上传 Office 文件大小控制
    TEAMSHARE_OFFICE_UPLOAD_MAX_SIZE: '500',

    // 工作台服务端地址
    TEAMSHARE_SERVICE_URL: 'https://teamshare-service.t.cn-shenzhen.aliyun.kkgroup.work/api',

    // 多维表格服务端 Socket 地址
    TEAMSHARE_SOCKET:
      'wss://teamshare-service.t.cn-shenzhen.aliyun.kkgroup.work/multidimensional_table',

    TEAMSHARE_SSO_URL: 'https://sso-t.kkguan.com',
    TEAMSHARE_SSO_APP_ID: '33311667307327',

    // 多维表格上传附件大小控制
    TEAMSHARE_TABLE_UPLOAD_MAX_SIZE: '10',

    // 企微扫码登录重定向地址
    SSO_WECOM_REDIRECT_URL: 'https://api.i-t.teamshare.cn',

    // 企微扫码登录 AgentId
    SSO_WECOM_AGENT_ID: '1000002',

    // 企微扫码登录 AppId
    SSO_WECOM_APP_ID: 'ww39354ca5c1fb9088',

    TEAMSHARE_NODE_SERVICE_URL: 'http://teamshare-service:9501',
    TEAMSHARE_WEB_URL:
      'http://teamshare-web.cde19b8e2c21340deb0f8dfefa46728a0.cn-shenzhen.alicontainer.com',
    KEEWOOD_MESSAGE_SOCKET: 'wss://keewood-v2-service.t.cn-shenzhen.aliyun.kkgroup.work/keewood',

    ...others,
  }
})()