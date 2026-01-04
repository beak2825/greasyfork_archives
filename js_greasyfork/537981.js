// ==UserScript==
// @name         AugmentCode Auto Register
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  自动注册 AugmentCode 账号 (基于 mail.tm API)
// @author       You
// @match        https://login.augmentcode.com/*
// @match        https://auth.augmentcode.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=augmentcode.com
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @license MIT
// @connect      api.mail.tm
// @downloadURL https://update.greasyfork.org/scripts/537981/AugmentCode%20Auto%20Register.user.js
// @updateURL https://update.greasyfork.org/scripts/537981/AugmentCode%20Auto%20Register.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // 配置参数
  const config = {
    // 是否自动填写注册表单
    autoFillForm: true,
    // 是否自动点击注册按钮
    autoSubmit: true, // 默认为 false，避免意外注册
    // 延迟时间（毫秒）
    delay: 1000,
    // mail.tm API URL
    apiUrl: 'https://api.mail.tm',
    // 检查邮件的间隔时间（毫秒）
    checkEmailInterval: 3000,
    // 最大检查邮件次数
    maxCheckEmailAttempts: 30,
    // 是否自动检查邮件
    autoCheckEmail: true,
    // 是否自动填写验证码
    autoFillVerificationCode: true,
    // 是否启用邮件自动刷新
    autoRefreshEmails: true,
    // 邮件自动刷新间隔（毫秒）
    autoRefreshInterval: 5000,
    // 是否显示刷新状态
    showRefreshStatus: true,
    // 授权服务 API URL
    authServiceUrl: 'https://xxx',
    // 授权服务秘钥
    authToken: 'xxx',
    // 是否使用授权服务
    useAuthService: true,
  };

  // 生成随机字符串
  function generateRandomString(length) {
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return result;
  }

  // 生成随机用户名
  function generateRandomUsername() {
    const firstNames = [
      'john',
      'jane',
      'alex',
      'sam',
      'chris',
      'pat',
      'taylor',
      'jordan',
      'casey',
      'riley',
    ];
    const lastNames = [
      'smith',
      'doe',
      'johnson',
      'williams',
      'brown',
      'jones',
      'miller',
      'davis',
      'garcia',
      'rodriguez',
    ];

    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const randomNum = Math.floor(Math.random() * 1000);

    return `${firstName}${lastName}${randomNum}`;
  }

  // Mail.tm 客户端类
  class MailTmClient {
    constructor() {
      this.domains = [];
      this.apiUrl = config.apiUrl;
      this.headers = {
        'Content-Type': 'application/json',
        Accept: '*/*',
      };
      this.emailAddress = null;
      this.emailPassword = null;
      this.emailToken = null;
      this.accountId = null;
    }

    // 获取可用域名列表
    async getDomains() {
      return new Promise((resolve, reject) => {
        const url = `${this.apiUrl}/domains`;

        GM_xmlhttpRequest({
          method: 'GET',
          url: url,
          headers: this.headers,
          timeout: 30000,
          onload: (response) => {
            try {
              if (response.status === 200) {
                const responseData = JSON.parse(response.responseText);
                const domainList = responseData['hydra:member'];

                if (domainList.length === 0) {
                  reject('获取域名列表失败，没有域名');
                  return;
                }

                const domains = [];
                for (const domain of domainList) {
                  domains.push(domain.domain);
                }

                this.domains = domains;
                resolve(domains);
              } else {
                reject(
                  `获取域名列表失败，HTTP状态码: ${response.status}, 详情: ${response.responseText}`
                );
              }
            } catch (error) {
              reject(`解析域名列表响应失败: ${error.message}`);
            }
          },
          onerror: (error) => {
            reject(`获取域名列表请求失败: ${error}`);
          },
          ontimeout: () => {
            reject('获取域名列表请求超时');
          },
        });
      });
    }

    // 生成邮箱账号
    async generate() {
      return new Promise(async (resolve, reject) => {
        try {
          if (this.domains.length === 0) {
            await this.getDomains();
          }

          const domain =
            this.domains[Math.floor(Math.random() * this.domains.length)];
          const name = generateRandomString(16).toLowerCase();
          const mailAddress = `${name}@${domain}`;

          this.emailAddress = mailAddress;
          this.emailPassword = generateRandomString(16);

          const url = `${this.apiUrl}/accounts`;

          GM_xmlhttpRequest({
            method: 'POST',
            url: url,
            headers: this.headers,
            timeout: 30000,
            data: JSON.stringify({
              address: this.emailAddress,
              password: this.emailPassword,
            }),
            onload: (response) => {
              if (response.status === 201) {
                const data = JSON.parse(response.responseText);
                resolve(data);
              } else {
                reject(
                  `创建邮箱地址失败，HTTP状态码: ${response.status}, 详情: ${response.responseText}`
                );
              }
            },
            onerror: (error) => {
              reject(`创建邮箱地址请求失败: ${error}`);
            },
            ontimeout: () => {
              reject('创建邮箱地址请求超时');
            },
          });
        } catch (error) {
          reject(`生成邮箱过程中发生错误: ${error.message}`);
        }
      });
    }

    // 获取认证令牌
    async auth() {
      return new Promise((resolve, reject) => {
        if (!this.emailAddress || !this.emailPassword) {
          reject(
            '邮箱地址或密码为空，请先调用 generate 方法设置邮箱地址和密码'
          );
          return;
        }

        const url = `${this.apiUrl}/token`;

        GM_xmlhttpRequest({
          method: 'POST',
          url: url,
          headers: this.headers,
          timeout: 30000,
          data: JSON.stringify({
            address: this.emailAddress,
            password: this.emailPassword,
          }),
          onload: (response) => {
            try {
              if (response.status === 200) {
                const token = JSON.parse(response.responseText);
                this.accountId = token.id;
                this.emailToken = token.token;
                this.headers['Authorization'] = `Bearer ${this.emailToken}`;
                resolve(token);
              } else {
                reject(
                  `获取邮箱token失败，HTTP状态码: ${response.status}, 详情: ${response.responseText}`
                );
              }
            } catch (error) {
              reject(`解析认证响应失败: ${error.message}`);
            }
          },
          onerror: (error) => {
            reject(`获取邮箱token请求失败: ${error}`);
          },
          ontimeout: () => {
            reject('获取邮箱token请求超时');
          },
        });
      });
    }

    // 获取邮箱地址（完整流程）
    async getEmailAddress() {
      await this.getDomains();
      await this.generate();
      await this.auth();
      return this.emailAddress;
    }

    // 销毁邮箱账号
    async destroy() {
      return new Promise((resolve, reject) => {
        if (!this.accountId || !this.emailToken) {
          reject('账号ID或令牌为空，无法销毁邮箱');
          return;
        }

        const url = `${this.apiUrl}/accounts/${this.accountId}`;

        GM_xmlhttpRequest({
          method: 'DELETE',
          url: url,
          headers: this.headers,
          timeout: 30000,
          onload: (response) => {
            if (response.status === 204) {
              resolve(true);
            } else {
              reject(
                `销毁邮箱地址失败，HTTP状态码: ${response.status}, 详情: ${response.responseText}`
              );
            }
          },
          onerror: (error) => {
            reject(`销毁邮箱地址请求失败: ${error}`);
          },
          ontimeout: () => {
            reject('销毁邮箱地址请求超时');
          },
        });
      });
    }

    // 获取邮件列表
    async getEmailList(forceRefresh = false) {
      return new Promise((resolve, reject) => {
        if (!this.emailAddress || !this.emailToken) {
          reject('邮箱地址或令牌为空，请先获取邮箱地址');
          return;
        }

        // 添加缓存破坏参数，确保获取最新邮件
        let url = `${this.apiUrl}/messages`;
        if (forceRefresh) {
          const timestamp = new Date().getTime();
          url = `${url}?_=${timestamp}`;
        }

        GM_xmlhttpRequest({
          method: 'GET',
          url: url,
          headers: this.headers,
          timeout: 30000,
          onload: async (response) => {
            try {
              if (response.status === 200) {
                const mailList = JSON.parse(response.responseText)[
                  'hydra:member'
                ];
                const emailList = [];

                if (mailList.length > 0) {
                  for (const mailItem of mailList) {
                    try {
                      // 获取邮件详情
                      const mailId = mailItem.id;
                      // 添加缓存破坏参数
                      const timestamp = forceRefresh
                        ? new Date().getTime()
                        : '';
                      const detailUrl = `${this.apiUrl}/messages/${mailId}${
                        forceRefresh ? `?_=${timestamp}` : ''
                      }`;

                      const detailResponse = await new Promise(
                        (resolveDetail, rejectDetail) => {
                          GM_xmlhttpRequest({
                            method: 'GET',
                            url: detailUrl,
                            headers: this.headers,
                            timeout: 30000,
                            onload: (detailResp) => resolveDetail(detailResp),
                            onerror: (error) => rejectDetail(error),
                            ontimeout: () =>
                              rejectDetail('获取邮件详情请求超时'),
                          });
                        }
                      );

                      if (detailResponse.status === 200) {
                        const mailData = JSON.parse(
                          detailResponse.responseText
                        );
                        emailList.push(this.convertMailData(mailData));
                      }
                    } catch (detailError) {
                      console.error('获取邮件详情失败:', detailError);
                    }
                  }
                }

                resolve(emailList);
              } else {
                reject(
                  `获取邮箱收件列表失败，HTTP状态码: ${response.status}, 详情: ${response.responseText}`
                );
              }
            } catch (error) {
              reject(`解析邮件列表响应失败: ${error.message}`);
            }
          },
          onerror: (error) => {
            reject(`获取邮箱收件列表请求失败: ${error}`);
          },
          ontimeout: () => {
            reject('获取邮箱收件列表请求超时');
          },
        });
      });
    }

    // 获取邮件列表（简化版，用于获取邮件按钮）
    async getEmails() {
      try {
        if (!this.emailAddress || !this.emailToken) {
          throw new Error('邮箱地址或令牌为空，请先获取邮箱地址');
        }

        // 强制刷新邮件列表，确保获取最新邮件
        const emailList = await this.getEmailList(true);
        return emailList;
      } catch (error) {
        console.error('获取邮件列表失败:', error);
        throw error;
      }
    }

    // 获取邮件内容
    async getEmailContent(emailId) {
      return new Promise((resolve, reject) => {
        if (!this.emailToken) {
          reject('未登录或令牌无效');
          return;
        }

        if (!emailId) {
          reject('邮件 ID 不能为空');
          return;
        }

        const url = `${this.apiUrl}/messages/${emailId}`;

        GM_xmlhttpRequest({
          method: 'GET',
          url: url,
          headers: this.headers,
          timeout: 30000,
          onload: (response) => {
            try {
              if (response.status === 200) {
                const mailData = JSON.parse(response.responseText);
                resolve(mailData);
              } else {
                reject(
                  `获取邮件内容失败，HTTP状态码: ${response.status}, 详情: ${response.responseText}`
                );
              }
            } catch (error) {
              reject(`解析邮件内容响应失败: ${error.message}`);
            }
          },
          onerror: (error) => {
            reject(`获取邮件内容请求失败: ${error}`);
          },
          ontimeout: () => {
            reject('获取邮件内容请求超时');
          },
        });
      });
    }

    // 转换邮件数据格式
    convertMailData(mailData) {
      const createdAt = mailData.createdAt; // "2025-01-27T09:54:45+00:00"
      const date = new Date(createdAt).getTime();
      const fromAddress = mailData.from.address;
      const toAddress = mailData.to[0].address;

      return {
        id: mailData.id,
        from: fromAddress,
        to: toAddress,
        subject: mailData.subject,
        date: date,
        body: mailData.text,
        html: mailData.html[0],
        createdAt: createdAt,
      };
    }
  }

  // 创建临时邮箱
  async function createTempEmail() {
    const mailClient = new MailTmClient();

    try {
      showAlert('正在创建临时邮箱...', 'info');
      await mailClient.getEmailAddress();

      showAlert(`临时邮箱创建成功: ${mailClient.emailAddress}`, 'success');

      return {
        email: mailClient.emailAddress,
        password: mailClient.emailPassword,
        token: mailClient.emailToken,
        accountId: mailClient.accountId,
        client: mailClient,
      };
    } catch (error) {
      const errorMsg = `创建临时邮箱失败: ${error.message || error}`;
      showAlert(errorMsg, 'error');
      throw new Error(errorMsg);
    }
  }

  // 检查邮箱中的验证邮件
  async function checkEmailForVerification(mailClient) {
    const maxAttempts = config.maxCheckEmailAttempts;
    const interval = config.checkEmailInterval;
    const statusDiv = document.getElementById('register-status');

    // 强制刷新一次邮件列表，确保获取最新邮件
    try {
      if (statusDiv && config.showRefreshStatus)
        statusDiv.innerHTML = '强制刷新邮件列表...';
      await forceRefreshEmails(mailClient);
    } catch (error) {
      console.error('强制刷新邮件失败:', error);
    }

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const message = `检查邮件 (${attempt}/${maxAttempts})...`;
        console.log(message);
        if (statusDiv && config.showRefreshStatus)
          statusDiv.innerHTML = message;

        // 获取邮件列表，使用缓存破坏参数
        const emails = await mailClient.getEmailList(true);

        if (emails.length > 0) {
          // 找到验证邮件
          for (const email of emails) {
            // 检查邮件主题是否包含关键字
            if (
              email.subject.toLowerCase().includes('verification') ||
              email.subject.toLowerCase().includes('confirm') ||
              email.subject.toLowerCase().includes('activate') ||
              email.subject.toLowerCase().includes('verify') ||
              email.subject.toLowerCase().includes('code') ||
              email.subject.toLowerCase().includes('验证')
            ) {
              console.log('找到验证邮件:', email.subject);
              if (statusDiv)
                statusDiv.innerHTML = `找到验证邮件: ${email.subject}`;

              // 获取邮件内容
              const emailContent = await mailClient.getEmailContent(email.id);

              // 处理 html 内容，可能是数组或字符串
              const htmlContent = Array.isArray(emailContent.html)
                ? emailContent.html[0]
                : emailContent.html;

              // 提取验证链接和验证码
              const verificationLink = extractVerificationLink(htmlContent);
              const verificationCode = extractVerificationCode(htmlContent);

              if (verificationLink || verificationCode) {
                console.log(
                  '找到验证信息:',
                  verificationLink || verificationCode
                );
                if (statusDiv)
                  statusDiv.innerHTML = `找到验证信息: ${
                    verificationLink || verificationCode
                  }`;

                // 显示弹窗提醒
                if (verificationCode) {
                  showAlert(`找到验证码: ${verificationCode}`, 'success');
                } else if (verificationLink) {
                  showAlert('找到验证链接，即将打开', 'success');
                }

                return {
                  success: true,
                  link: verificationLink,
                  code: verificationCode,
                  emailContent,
                };
              }
            }
          }
        }

        // 在等待之前再次尝试强制刷新
        if (attempt % 3 === 0) {
          // 每3次尝试强制刷新一次
          try {
            if (statusDiv && config.showRefreshStatus)
              statusDiv.innerHTML = `强制刷新邮件列表 (${attempt}/${maxAttempts})...`;
            await forceRefreshEmails(mailClient);
          } catch (refreshError) {
            console.error('强制刷新邮件失败:', refreshError);
          }
        }

        // 等待一段时间后再次检查
        await new Promise((resolve) => setTimeout(resolve, interval));
      } catch (error) {
        console.error('检查邮件出错:', error);
        if (statusDiv)
          statusDiv.innerHTML = `检查邮件出错: ${error.message || error}`;

        // 出错后短暂等待后继续
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    const message = '未找到验证邮件或链接';
    console.warn(message);
    if (statusDiv) statusDiv.innerHTML = message;
    return { success: false, message };
  }

  // 强制刷新邮件列表
  async function forceRefreshEmails(mailClient) {
    if (!mailClient || !mailClient.emailToken) {
      throw new Error('邮箱客户端未初始化或未登录');
    }

    // 使用不同的请求参数强制刷新
    const timestamp = new Date().getTime();
    const url = `${mailClient.apiUrl}/messages?_=${timestamp}`;

    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: 'GET',
        url: url,
        headers: mailClient.headers,
        timeout: 30000,
        onload: (response) => {
          try {
            if (response.status === 200) {
              console.log('邮件列表强制刷新成功');
              resolve(true);
            } else {
              reject(`强制刷新邮件列表失败，HTTP状态码: ${response.status}`);
            }
          } catch (error) {
            reject(`解析强制刷新响应失败: ${error.message}`);
          }
        },
        onerror: (error) => {
          reject(`强制刷新邮件列表请求失败: ${error}`);
        },
        ontimeout: () => {
          reject('强制刷新邮件列表请求超时');
        },
      });
    });
  }

  // 从 HTML 中提取验证链接
  function extractVerificationLink(html) {
    if (!html) return null;

    // 尝试多种正则表达式模式匹配验证链接
    const patterns = [
      /href="([^"]*verify[^"]*)"/i, // 双引号形式的链接
      /href='([^']*verify[^']*)'/i, // 单引号形式的链接
      /href="([^"]*confirm[^"]*)"/i, // 双引号形式的确认链接
      /href='([^']*confirm[^']*)'/i, // 单引号形式的确认链接
      /href="([^"]*activate[^"]*)"/i, // 双引号形式的激活链接
      /href='([^']*activate[^']*)'/i, // 单引号形式的激活链接
      /href="([^"]*validation[^"]*)"/i, // 双引号形式的验证链接
      /href='([^']*validation[^']*)'/i, // 单引号形式的验证链接
    ];

    for (const pattern of patterns) {
      const match = html.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }

    // 如果没有找到特定的验证关键词，尝试匹配任何链接
    const anyLinkPattern = /href="([^"]*augmentcode[^"]*)"/i;
    const anyLinkMatch = html.match(anyLinkPattern);
    if (anyLinkMatch && anyLinkMatch[1]) {
      return anyLinkMatch[1];
    }

    return null;
  }

  // 从 HTML 中提取验证码
  function extractVerificationCode(html) {
    if (!html) return null;

    // 尝试多种正则表达式模式匹配验证码
    const patterns = [
      /verification code is:?\s*([0-9]{6})/i, // 常见的验证码格式
      /code is:?\s*([0-9]{6})/i, // 简化的验证码格式
      /code:?\s*([0-9]{6})/i, // 更简化的验证码格式
      /([0-9]{6})\s*is your verification code/i, // 另一种常见格式
      /([0-9]{6})\s*is your code/i, // 另一种简化格式
      /([0-9]{6})/, // 匹配任何 6 位数字（最后尝试）
    ];

    for (const pattern of patterns) {
      const match = html.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }

    return null;
  }

  // 自动填写验证码并提交
  function fillVerificationCode(code) {
    if (!code) return false;

    try {
      // 查找验证码输入框
      const codeInput = document.querySelector(
        'input[name="code"], input#code'
      );
      const submitButton = document.querySelector(
        'button[type="submit"], button[name="action"]'
      );

      if (codeInput && submitButton) {
        // 填写验证码
        codeInput.value = code;
        codeInput.dispatchEvent(new Event('input', { bubbles: true }));

        console.log('验证码已自动填写:', code);
        showAlert(`验证码已自动填写: ${code}`, 'success');

        // 点击提交按钮
        setTimeout(() => {
          submitButton.click();
          console.log('自动点击提交按钮');
          showAlert('验证码已提交', 'info');
        }, 500);

        return true;
      } else {
        console.warn('未找到验证码输入框或提交按钮');
        return false;
      }
    } catch (error) {
      console.error('填写验证码失败:', error);
      return false;
    }
  }

  // 提取验证链接并打开
  async function processVerificationEmail(mailClient) {
    try {
      console.log('等待验证邮件...');
      const verificationLink = await checkEmailForVerification(mailClient);
      console.log('找到验证链接:', verificationLink);

      // 打开验证链接
      window.open(verificationLink, '_blank');
      return verificationLink;
    } catch (error) {
      console.error('验证邮件处理失败:', error);
      throw error;
    }
  }

  // 填写注册表单
  function fillRegistrationForm() {
    return new Promise(async (resolve, reject) => {
      try {
        console.log('开始创建临时邮箱...');
        const emailData = await createTempEmail();
        console.log('临时邮箱创建成功:', emailData.email);

        // 保存邮箱信息到本地存储
        GM_setValue('lastEmailData', {
          email: emailData.email,
          password: emailData.password,
          createdAt: new Date().toISOString(),
        });

        // 等待页面加载完成
        setTimeout(() => {
          // 检查是否在注册页面
          if (window.location.href.includes('augmentcode.com')) {
            // 查找用户名/邮箱输入框
            const emailInput = document.querySelector(
              'input[name="username"], input[inputmode="email"]'
            );
            const signUpButton = document.querySelector(
              'button[type="submit"], button[name="action"]'
            );

            if (emailInput) {
              // 填写表单
              emailInput.value = emailData.email;
              emailInput.dispatchEvent(new Event('input', { bubbles: true }));

              console.log('表单已自动填写');
              console.log('邮箱:', emailData.email);

              // 如果配置了自动提交
              if (config.autoSubmit) {
                setTimeout(() => {
                  signUpButton.click();
                  console.log('自动点击注册按钮');

                  // 等待验证邮件
                  setTimeout(async () => {
                    try {
                      await processVerificationEmail(emailData.client);
                    } catch (error) {
                      console.error('验证邮件处理失败:', error);
                    }
                  }, 5000); // 等待 5 秒后开始检查邮件
                }, config.delay);
              }

              resolve(emailData);
            } else {
              reject('无法找到注册表单元素');
            }
          } else {
            reject('不在 AugmentCode 注册页面');
          }
        }, config.delay);
      } catch (error) {
        reject('填写注册表单失败: ' + error);
      }
    });
  }

  // 显示弹窗提醒
  function showAlert(message, type = 'info') {
    // 创建弹窗元素
    const alertDiv = document.createElement('div');
    alertDiv.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            padding: 15px 20px;
            border-radius: 5px;
            font-size: 14px;
            z-index: 10000;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            transition: opacity 0.3s ease;
            max-width: 80%;
            text-align: center;
        `;

    // 根据类型设置样式
    switch (type) {
      case 'success':
        alertDiv.style.backgroundColor = 'rgba(76, 175, 80, 0.9)';
        alertDiv.style.color = 'white';
        break;
      case 'error':
        alertDiv.style.backgroundColor = 'rgba(244, 67, 54, 0.9)';
        alertDiv.style.color = 'white';
        break;
      case 'warning':
        alertDiv.style.backgroundColor = 'rgba(255, 152, 0, 0.9)';
        alertDiv.style.color = 'white';
        break;
      default: // info
        alertDiv.style.backgroundColor = 'rgba(33, 150, 243, 0.9)';
        alertDiv.style.color = 'white';
    }

    // 设置内容
    alertDiv.innerHTML = message;

    // 添加到页面
    document.body.appendChild(alertDiv);

    // 5秒后消失
    setTimeout(() => {
      alertDiv.style.opacity = '0';
      setTimeout(() => {
        document.body.removeChild(alertDiv);
      }, 300);
    }, 5000);

    return alertDiv;
  }

  // 检查是否有上次使用的邮箱信息
  function getLastEmailData() {
    try {
      return GM_getValue('lastEmailData', null);
    } catch (error) {
      console.warn('获取上次邮箱信息失败:', error);
      return null;
    }
  }

  // 清除上次使用的邮箱信息
  function clearLastEmailData() {
    try {
      GM_deleteValue('lastEmailData');
      showAlert('邮箱信息已清除', 'success');
      return true;
    } catch (error) {
      console.warn('清除上次邮箱信息失败:', error);
      showAlert(`清除邮箱信息失败: ${error.message || error}`, 'error');
      return false;
    }
  }

  // 创建控制面板
  function createControlPanel() {
    const panel = document.createElement('div');
    panel.id = 'augmentcode-auto-register-panel';
    panel.style.cssText =
      'position: fixed; top: 10px; right: 10px; background: rgba(0, 0, 0, 0.8); color: white; padding: 10px; border-radius: 5px; z-index: 9999; font-size: 12px; width: 250px;';

    // 获取上次使用的邮箱信息
    const lastEmailData = getLastEmailData();

    let panelContent = `
            <div style="margin-bottom: 10px; text-align: center; font-weight: bold; font-size: 14px;">AugmentCode 自动注册</div>
        `;

    // 按照逻辑顺序添加按钮
    // 1. 使用授权服务登录
    if (config.useAuthService) {
      panelContent += `
                <button id="use-auth-service" style="background: #9C27B0; color: white; border: none; padding: 5px 10px; margin-bottom: 5px; border-radius: 3px; cursor: pointer; width: 100%">1. 使用授权服务登录</button>
            `;
    }

    // 2. 获取邮件自动填充
    if (!lastEmailData) {
      panelContent += `
                <button id="auto-register" style="background: #4CAF50; color: white; border: none; padding: 5px 10px; margin-bottom: 5px; border-radius: 3px; cursor: pointer; width: 100%">2. 获取邮件自动填充</button>
            `;
    } else {
      panelContent += `
                <div style="margin-bottom: 10px;">
                    <div><strong>邮箱地址:</strong> ${lastEmailData.email}</div>
                    <div><strong>密码:</strong> ${lastEmailData.password}</div>
                </div>
            `;
    }

    // 3. 获取邮件信息，验证码
    if (lastEmailData) {
      panelContent += `
                <button id="check-emails" style="background: #2196F3; color: white; border: none; padding: 5px 10px; margin-bottom: 5px; border-radius: 3px; cursor: pointer; width: 100%">3. 获取邮件信息和验证码</button>
            `;
    }

    // 4. 自动勾选服务条款并点击注册按钮
    if (lastEmailData) {
      panelContent += `
                <button id="auto-verify" style="background: #FF9800; color: white; border: none; padding: 5px 10px; margin-bottom: 5px; border-radius: 3px; cursor: pointer; width: 100%">4. 自动勾选服务条款并注册</button>
            `;
    }

    // 5. 发送授权信息到服务器
    if (config.useAuthService) {
      panelContent += `
                <button id="send-auth-data" style="background: #FF5722; color: white; border: none; padding: 5px 10px; margin-bottom: 5px; border-radius: 3px; cursor: pointer; width: 100%">5. 手动发送授权信息到服务器</button>
            `;
    }

    // 添加清除邮箱信息按钮
    if (lastEmailData) {
      panelContent += `
                <button id="clear-email" style="background: #f44336; color: white; border: none; padding: 5px 10px; margin-bottom: 5px; border-radius: 3px; cursor: pointer; width: 100%">清除邮箱信息</button>
            `;
    }

    // 添加配置选项
    panelContent += `
            <div style="margin-top: 10px; border-top: 1px solid #555; padding-top: 5px;">
                <div style="margin-bottom: 5px; font-size: 11px;">
                    <label style="display: flex; align-items: center;">
                        <input type="checkbox" id="auto-check-email" ${
                          config.autoCheckEmail ? 'checked' : ''
                        }>
                        <span style="margin-left: 5px;">自动检查邮件</span>
                    </label>
                </div>
                <div style="margin-bottom: 5px; font-size: 11px;">
                    <label style="display: flex; align-items: center;">
                        <input type="checkbox" id="auto-fill-code" ${
                          config.autoFillVerificationCode ? 'checked' : ''
                        }>
                        <span style="margin-left: 5px;">自动填写验证码</span>
                    </label>
                </div>
                <div style="margin-bottom: 5px; font-size: 11px;">
                    <label style="display: flex; align-items: center;">
                        <input type="checkbox" id="use-auth-service-toggle" ${
                          config.useAuthService ? 'checked' : ''
                        }>
                        <span style="margin-left: 5px;">使用授权服务</span>
                    </label>
                </div>
            </div>
        `;

    panelContent += `
            <div id="register-status" style="margin-top: 10px; font-size: 11px; color: #ddd;">就绪就绪</div>
        `;

    panel.innerHTML = panelContent;
    return panel;
  }

  // 自动勾选服务条款并点击注册按钮
  function autoAcceptTermsAndSignUp() {
    try {
      const statusDiv = document.getElementById('register-status');
      if (statusDiv) statusDiv.innerHTML = '正在自动勾选服务条款...';

      // 查找服务条款复选框
      const termsCheckbox = document.getElementById(
        'terms-of-service-checkbox'
      );
      // 查找注册按钮
      const signUpButton = document.querySelector('button#signup-button');

      if (termsCheckbox && signUpButton) {
        // 勾选服务条款
        if (!termsCheckbox.checked) {
          termsCheckbox.checked = true;
          termsCheckbox.dispatchEvent(new Event('change', { bubbles: true }));
          console.log('自动勾选服务条款');
          if (statusDiv)
            statusDiv.innerHTML = '服务条款已自动勾选，正在点击注册按钮...';
          showAlert('服务条款已自动勾选', 'success');
        }

        // 点击注册按钮
        setTimeout(() => {
          signUpButton.click();
          console.log('自动点击注册按钮');
          if (statusDiv)
            statusDiv.innerHTML = '注册按钮已自动点击，正在处理...';
          showAlert('注册按钮已自动点击，正在处理...', 'info');
          
          // 确保控制面板在点击后仍然存在
          setTimeout(() => {
            // 刷新控制面板
            const existingPanel = document.getElementById(
              'augmentcode-auto-register-panel'
            );
            if (!existingPanel) {
              const newPanel = createControlPanel();
              document.body.appendChild(newPanel);
              // 重新绑定事件
              bindEvents();
            }
          }, 500);
        }, 500);

        return true;
      } else {
        console.warn('未找到服务条款复选框或注册按钮');
        if (statusDiv)
          statusDiv.innerHTML = '未找到服务条款复选框或注册按钮，请手动操作';
        return false;
      }
    } catch (error) {
      console.error('自动勾选服务条款失败:', error);
      const statusDiv = document.getElementById('register-status');
      if (statusDiv)
        statusDiv.innerHTML = `自动勾选服务条款失败: ${error.message || error}`;
      return false;
    }
  }

  // 自动化处理验证码和邮件验证流程
  async function autoProcessVerification() {
    const statusDiv = document.getElementById('register-status');
    if (statusDiv) statusDiv.innerHTML = '开始自动处理验证流程...';

    try {
      // 获取上次使用的邮箱信息
      const lastEmailData = getLastEmailData();
      if (!lastEmailData) {
        if (statusDiv)
          statusDiv.innerHTML = '没有找到邮箱信息，请先创建邮箱或填写注册表单';
        return;
      }

      // 创建邮箱客户端
      const client = new MailTmClient();
      client.emailAddress = lastEmailData.email;
      client.emailPassword = lastEmailData.password;

      // 认证
      if (statusDiv) statusDiv.innerHTML = '正在登录邮箱...';
      await client.auth();

      // 检查邮件中的验证信息
      const verificationResult = await checkEmailForVerification(client);

      if (verificationResult.success) {
        // 如果找到验证码，自动填写
        if (verificationResult.code && config.autoFillVerificationCode) {
          if (statusDiv)
            statusDiv.innerHTML = `找到验证码: ${verificationResult.code}，正在自动填写...`;
          const success = fillVerificationCode(verificationResult.code);
          if (success) {
            if (statusDiv)
              statusDiv.innerHTML = `验证码已自动填写并提交: ${verificationResult.code}`;
          } else {
            if (statusDiv)
              statusDiv.innerHTML = `验证码填写失败，请手动填写: ${verificationResult.code}`;
          }
        }
        // 如果找到验证链接，自动打开
        else if (verificationResult.link) {
          if (statusDiv) statusDiv.innerHTML = `找到验证链接，正在打开...`;
          window.open(verificationResult.link, '_blank');
        }
      } else {
        if (statusDiv)
          statusDiv.innerHTML =
            verificationResult.message || '自动处理验证流程失败';
      }
    } catch (error) {
      console.error('自动处理验证流程出错:', error);
      if (statusDiv)
        statusDiv.innerHTML = `自动处理验证流程出错: ${error.message || error}`;
    }
  }

  // 获取授权链接
  async function getAuthorizeUrl() {
    return new Promise((resolve, reject) => {
      if (!config.useAuthService) {
        reject('未启用授权服务');
        return;
      }

      const url = `${config.authServiceUrl}/auth`;

      GM_xmlhttpRequest({
        method: 'GET',
        url: url,
        headers: {
          'x-auth-token': config.authToken,
          'Content-Type': 'application/json',
        },
        timeout: 30000,
        onload: (response) => {
          console.log('获取授权链接响应:', response.responseText);
          try {
            if (response.status === 200) {
              const data = JSON.parse(response.responseText);
              if (data.authorize_url) {
                resolve(data.authorize_url);
              } else {
                reject('响应中没有授权链接');
              }
            } else {
              reject(
                `获取授权链接失败，HTTP状态码: ${response.status}, 详情: ${response.responseText}`
              );
            }
          } catch (error) {
            reject(`解析授权链接响应失败: ${error.message}`);
          }
        },
        onerror: (error) => {
          reject(`获取授权链接请求失败: ${error}`);
        },
        ontimeout: () => {
          reject('获取授权链接请求超时');
        },
      });
    });
  }

  // 发送回调数据
  async function sendCallbackData(code, state, tenantUrl) {
    return new Promise((resolve, reject) => {
      if (!config.useAuthService) {
        reject('未启用授权服务');
        return;
      }

      if (!code || !state) {
        reject('缺少必要的回调参数');
        return;
      }

      const url = `${config.authServiceUrl}/callback`;
      const data = {
        code: code,
        state: state,
        tenant_url: tenantUrl || '',
      };

      GM_xmlhttpRequest({
        method: 'POST',
        url: url,
        headers: {
          'x-auth-token': config.authToken,
          'Content-Type': 'application/json',
        },
        data: JSON.stringify(data),
        timeout: 30000,
        onload: (response) => {
          try {
            if (response.status === 200) {
              const data = JSON.parse(response.responseText);
              resolve(data);
            } else {
              reject(
                `发送回调数据失败，HTTP状态码: ${response.status}, 详情: ${response.responseText}`
              );
            }
          } catch (error) {
            reject(`解析回调响应失败: ${error.message}`);
          }
        },
        onerror: (error) => {
          reject(`发送回调数据请求失败: ${error}`);
        },
        ontimeout: () => {
          reject('发送回调数据请求超时');
        },
      });
    });
  }

  // 从 URL 中提取参数
  function getParameterByName(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
    const results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  }

  // 从页面提取回调数据
  function extractCallbackDataFromPage() {
    try {
      // 专门从脚本标签中提取数据
      const scripts = document.querySelectorAll('script');
      for (const script of scripts) {
        const content = script.textContent || script.innerText;
        if (!content) continue;

        // 尝试查找复制按钮的点击事件处理程序
        if (
          content.includes('copyButton') &&
          content.includes('addEventListener') &&
          content.includes('code') &&
          content.includes('state')
        ) {
          try {
            // 尝试提取 data 对象
            const dataMatch = content.match(/let\s+data\s*=\s*(\{[\s\S]*?\})/);
            if (dataMatch && dataMatch[1]) {
              try {
                // 尝试直接从字符串中提取必要的字段
                const matchedStr = dataMatch[1];
                const codeMatch = matchedStr.match(
                  /code["']?\s*:\s*["']([^"']+)["']/
                );
                const stateMatch = matchedStr.match(
                  /state["']?\s*:\s*["']([^"']+)["']/
                );
                const tenantUrlMatch = matchedStr.match(
                  /tenant_url["']?\s*:\s*["']([^"']+)["']/
                );

                if (codeMatch && stateMatch) {
                  const extractedData = {
                    code: codeMatch[1],
                    state: stateMatch[1],
                    tenant_url: tenantUrlMatch ? tenantUrlMatch[1] : '',
                  };
                  console.log('从复制按钮脚本中提取到数据:', extractedData);
                  return extractedData;
                }

                // 如果上面的方法失败，尝试清理字符串后再解析
                try {
                  // 尝试清理字符串中的空格和换行符
                  const cleanedStr = matchedStr.replace(/\s+/g, ' ').trim();
                  const jsonData = JSON.parse(cleanedStr);
                  if (jsonData.code && jsonData.state) {
                    console.log('清理后解析成功:', jsonData);
                    return {
                      code: jsonData.code,
                      state: jsonData.state,
                      tenant_url: jsonData.tenant_url || '',
                    };
                  }
                } catch (innerError) {
                  console.error('清理后仍然解析失败:', innerError);
                }
              } catch (parseError) {
                console.error('解析复制按钮脚本中的 JSON 失败:', parseError);
              }
            }

            // 如果上面的方法失败，尝试使用更通用的正则表达式
            const jsonRegex =
              /\{[\s\S]*?"code"\s*:\s*"[^"]+"[\s\S]*?"state"\s*:\s*"[^"]+"[\s\S]*?\}/g;
            const jsonMatches = content.match(jsonRegex);

            if (jsonMatches) {
              for (const jsonStr of jsonMatches) {
                try {
                  // 尝试直接从字符串中提取必要的字段
                  const codeMatch = jsonStr.match(
                    /code["']?\s*:\s*["']([^"']+)["']/
                  );
                  const stateMatch = jsonStr.match(
                    /state["']?\s*:\s*["']([^"']+)["']/
                  );
                  const tenantUrlMatch = jsonStr.match(
                    /tenant_url["']?\s*:\s*["']([^"']+)["']/
                  );

                  if (codeMatch && stateMatch) {
                    const extractedData = {
                      code: codeMatch[1],
                      state: stateMatch[1],
                      tenant_url: tenantUrlMatch ? tenantUrlMatch[1] : '',
                    };
                    console.log('从脚本中提取到 JSON 数据:', extractedData);
                    return extractedData;
                  }

                  // 如果上面的方法失败，尝试清理字符串后再解析
                  try {
                    // 尝试清理字符串中的空格和换行符
                    const cleanedStr = jsonStr.replace(/\s+/g, ' ').trim();
                    const jsonData = JSON.parse(cleanedStr);
                    if (jsonData.code && jsonData.state) {
                      console.log('清理后解析成功:', jsonData);
                      return {
                        code: jsonData.code,
                        state: jsonData.state,
                        tenant_url: jsonData.tenant_url || '',
                      };
                    }
                  } catch (innerError) {
                    console.error('清理后仍然解析失败:', innerError);
                  }
                } catch (e) {
                  console.error('解析脚本中的 JSON 字符串失败:', e);
                }
              }
            }
          } catch (e) {
            console.error('从复制按钮脚本提取数据失败:', e);
          }
        }
      }

      // 如果没有从脚本中找到数据，尝试从复制按钮中获取
      const copyBtn = document.getElementById('copyButton');
      if (copyBtn) {
        try {
          // 尝试直接获取复制按钮的点击事件处理程序
          const buttonEvents = getEventListeners(copyBtn);
          if (
            buttonEvents &&
            buttonEvents.click &&
            buttonEvents.click.length > 0
          ) {
            // 尝试模拟点击事件来获取数据
            console.log('尝试模拟点击复制按钮获取数据');
          }
        } catch (e) {
          console.error('获取复制按钮事件失败:', e);
        }
      }

      // 如果还是没有找到，尝试从页面文本中提取单独的字段
      try {
        const pageText = document.body.innerText;
        const codeMatch = pageText.match(/code["']?\s*:\s*["']([^"']+)["']/);
        const stateMatch = pageText.match(/state["']?\s*:\s*["']([^"']+)["']/);
        const tenantUrlMatch = pageText.match(
          /tenant_url["']?\s*:\s*["']([^"']+)["']/
        );

        if (codeMatch && stateMatch) {
          return {
            code: codeMatch[1],
            state: stateMatch[1],
            tenant_url: tenantUrlMatch ? tenantUrlMatch[1] : '',
          };
        }
      } catch (e) {
        console.error('从页面文本提取数据失败:', e);
      }

      return null;
    } catch (error) {
      console.error('从页面提取回调数据失败:', error);
      return null;
    }
  }

  // 主函数
  async function main() {
    try {
      console.log('AugmentCode 自动注册脚本已启动');

      // 检查是否在 AugmentCode 网站
      if (window.location.href.includes('augmentcode.com')) {
        // 在所有情况下都添加控制面板
        const existingPanel = document.getElementById(
          'augmentcode-auto-register-panel'
        );
        if (existingPanel) {
          existingPanel.remove();
        }

        const controlPanel = createControlPanel();
        document.body.appendChild(controlPanel);

        // 绑定所有事件
        bindEvents();

        // 如果在注册确认页面，自动勾选服务条款并点击注册按钮
        if (
          window.location.href.includes('auth.augmentcode.com') &&
          document.getElementById('terms-of-service-checkbox')
        ) {
          autoAcceptTermsAndSignUp();
        }

        // 检查是否在回调页面，如果是则提取数据并发送回调
        if (config.useAuthService) {
          const callbackData = extractCallbackDataFromPage();
          if (callbackData) {
            try {
              console.log('检测到回调页面，正在发送回调数据...');
              // 显示弹窗提醒
              showAlert('检测到回调页面，正在发送回调数据...', 'info');

              const result = await sendCallbackData(
                callbackData.code,
                callbackData.state,
                callbackData.tenant_url
              );
              console.log('回调数据发送成功:', result);

              // 显示成功弹窗提醒
              showAlert(
                `授权数据已成功发送到服务器 ${JSON.stringify(result)}`,
                'success'
              );

              // 显示成功消息
              const successDiv = document.createElement('div');
              successDiv.style.cssText =
                'position: fixed; top: 10px; right: 10px; background: rgba(0, 150, 0, 0.8); color: white; padding: 10px; border-radius: 5px; z-index: 9999; font-size: 14px;';
              successDiv.innerHTML = '授权数据已成功发送到服务器';
              document.body.appendChild(successDiv);

              // 3秒后移除消息
              setTimeout(() => {
                document.body.removeChild(successDiv);
              }, 3000);
            } catch (error) {
              console.error('发送回调数据失败:', error);
              // 显示错误弹窗提醒
              showAlert(`发送回调数据失败: ${error.message || error}`, 'error');
            }
          }
        }

        // 检查是否需要自动填写验证码
        // 如果当前页面是验证码输入页面，并且配置了自动检查邮件
        if (
          config.autoCheckEmail &&
          document.querySelector('input[name="code"], input#code')
        ) {
          console.log('检测到验证码输入页面，开始自动处理验证流程...');
          setTimeout(autoProcessVerification, 1000); // 延迟1秒执行，确保页面完全加载
        }
      }
    } catch (error) {
      console.error('AugmentCode 自动注册脚本出错:', error);
    }
  }

  // 获取邮件并显示
  async function checkAndDisplayEmails(silentMode = false) {
    const statusDiv = document.getElementById('register-status');
    if (!silentMode) {
      statusDiv.innerHTML = '正在获取邮件...';
    }

    try {
      // 获取上次使用的邮箱信息
      const lastEmailData = getLastEmailData();
      if (!lastEmailData) {
        if (!silentMode) statusDiv.innerHTML = '没有找到邮箱信息';
        return;
      }

      // 创建邮箱客户端
      const client = new MailTmClient(config.apiUrl);

      // 设置邮箱信息
      client.emailAddress = lastEmailData.email;
      client.emailPassword = lastEmailData.password;

      // 认证
      if (!silentMode) statusDiv.innerHTML = '正在登录邮箱...';
      await client.auth();

      // 获取邮件列表
      if (!silentMode) statusDiv.innerHTML = '正在获取邮件列表...';
      const emails = await client.getEmails();

      if (emails.length === 0) {
        if (!silentMode) statusDiv.innerHTML = '邮箱中没有邮件';
        return;
      }

      // 如果是静默模式，只检查是否有验证邮件，不显示完整列表
      if (silentMode) {
        // 检查是否有验证邮件
        for (const email of emails) {
          if (
            email.subject.toLowerCase().includes('verification') ||
            email.subject.toLowerCase().includes('confirm') ||
            email.subject.toLowerCase().includes('activate') ||
            email.subject.toLowerCase().includes('verify') ||
            email.subject.toLowerCase().includes('code') ||
            email.subject.toLowerCase().includes('验证')
          ) {
            if (statusDiv && config.showRefreshStatus) {
              statusDiv.innerHTML = `找到验证邮件: ${email.subject}`;
            }
            break;
          }
        }
        return;
      }

      // 显示邮件列表
      let emailListHtml =
        '<div style="margin-top: 10px; max-height: 200px; overflow-y: auto;">';
      emailListHtml +=
        '<h4 style="margin: 0 0 5px 0; font-size: 14px;">邮件列表</h4>';

      for (const email of emails) {
        const date = new Date(email.createdAt).toLocaleString();
        emailListHtml += `
                    <div style="padding: 5px; margin-bottom: 5px; border-bottom: 1px solid #555; font-size: 12px;">
                        <div><strong>主题:</strong> ${email.subject}</div>
                        <div><strong>发件人:</strong> ${email.from.address}</div>
                        <div><strong>时间:</strong> ${date}</div>
                        <button class="view-email-btn" data-id="${email.id}" style="background: #2196F3; color: white; border: none; padding: 2px 5px; margin-top: 3px; border-radius: 3px; cursor: pointer; font-size: 10px;">查看内容</button>
                    </div>
                `;
      }

      emailListHtml += '</div>';
      statusDiv.innerHTML = emailListHtml;

      // 绑定查看邮件内容按钮事件
      document.querySelectorAll('.view-email-btn').forEach((button) => {
        button.addEventListener('click', async () => {
          const emailId = button.getAttribute('data-id');
          try {
            // 获取邮件内容
            const emailContent = await client.getEmailContent(emailId);

            // 处理 html 内容，可能是数组或字符串
            const htmlContent = Array.isArray(emailContent.html)
              ? emailContent.html[0]
              : emailContent.html;

            // 分析邮件内容，提取验证链接和验证码
            const verificationLink = extractVerificationLink(htmlContent);
            const verificationCode = extractVerificationCode(htmlContent);

            // 创建模态框显示邮件内容
            const modal = document.createElement('div');
            modal.style.cssText =
              'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.7); display: flex; justify-content: center; align-items: center; z-index: 10000;';

            let modalContent = `
                            <div style="background: white; color: black; padding: 20px; border-radius: 5px; max-width: 80%; max-height: 80%; overflow-y: auto; position: relative;">
                                <button id="close-modal" style="position: absolute; top: 10px; right: 10px; background: #f44336; color: white; border: none; width: 25px; height: 25px; border-radius: 50%; cursor: pointer; font-weight: bold;">&times;</button>
                                <h3 style="margin-top: 0;">${
                                  emailContent.subject
                                }</h3>
                                <div style="margin-bottom: 10px;">
                                    <strong>发件人:</strong> ${
                                      emailContent.from.address
                                    }<br>
                                    <strong>时间:</strong> ${new Date(
                                      emailContent.createdAt
                                    ).toLocaleString()}
                                </div>
                        `;

            // 如果有验证链接，显示打开链接按钮
            if (verificationLink) {
              modalContent += `
                                <div style="margin-bottom: 15px; padding: 10px; background: #e8f5e9; border-radius: 5px;">
                                    <strong>找到验证链接:</strong><br>
                                    <a href="${verificationLink}" target="_blank" style="word-break: break-all;">${verificationLink}</a><br>
                                    <button id="open-verification-link" style="background: #4CAF50; color: white; border: none; padding: 5px 10px; margin-top: 5px; border-radius: 3px; cursor: pointer;">打开验证链接</button>
                                </div>
                            `;
            }

            // 如果有验证码，显示填写验证码按钮
            if (verificationCode) {
              modalContent += `
                                <div style="margin-bottom: 15px; padding: 10px; background: #e3f2fd; border-radius: 5px;">
                                    <strong>找到验证码:</strong> <span style="font-size: 18px; font-weight: bold;">${verificationCode}</span><br>
                                    <button id="fill-verification-code" style="background: #2196F3; color: white; border: none; padding: 5px 10px; margin-top: 5px; border-radius: 3px; cursor: pointer;">自动填写验证码</button>
                                </div>
                            `;
            }

            // 显示邮件内容
            modalContent += `
                                <div style="border-top: 1px solid #ddd; padding-top: 10px;">
                                    <iframe id="email-content-frame" style="width: 100%; height: 400px; border: 1px solid #ddd;"></iframe>
                                </div>
                            </div>
                        `;

            modal.innerHTML = modalContent;
            document.body.appendChild(modal);

            // 将邮件 HTML 内容加载到 iframe 中
            const iframe = document.getElementById('email-content-frame');
            iframe.onload = function () {
              const iframeDoc =
                iframe.contentDocument || iframe.contentWindow.document;
              iframeDoc.open();
              // 处理 html 内容，可能是数组或字符串
              const htmlContent = Array.isArray(emailContent.html)
                ? emailContent.html[0]
                : emailContent.html;
              iframeDoc.write(htmlContent || '邮件内容为空');
              iframeDoc.close();
            };
            iframe.onload();

            // 绑定关闭按钮事件
            document
              .getElementById('close-modal')
              .addEventListener('click', () => {
                document.body.removeChild(modal);
              });

            // 绑定打开验证链接按钮事件
            const openLinkButton = document.getElementById(
              'open-verification-link'
            );
            if (openLinkButton) {
              openLinkButton.addEventListener('click', () => {
                window.open(verificationLink, '_blank');
              });
            }

            // 绑定填写验证码按钮事件
            const fillCodeButton = document.getElementById(
              'fill-verification-code'
            );
            if (fillCodeButton && verificationCode) {
              fillCodeButton.addEventListener('click', () => {
                // 尝试填写验证码
                const success = fillVerificationCode(verificationCode);

                // 如果成功，关闭模态框
                if (success) {
                  document.body.removeChild(modal);
                } else {
                  fillCodeButton.textContent = '填写失败，请手动填写';
                  fillCodeButton.style.backgroundColor = '#f44336';
                }
              });
            }
          } catch (error) {
            console.error('获取邮件内容失败:', error);
            statusDiv.innerHTML = `错误: 获取邮件内容失败 - ${
              error.message || error
            }`;
          }
        });
      });
    } catch (error) {
      console.error('获取邮件失败:', error);
      statusDiv.innerHTML = `错误: 获取邮件失败 - ${error.message || error}`;
    }
  }

  // 绑定所有事件
  function bindEvents() {
    // 添加自动注册按钮事件
    const registerButton = document.getElementById('auto-register');
    if (registerButton) {
      registerButton.addEventListener('click', async () => {
        const statusDiv = document.getElementById('register-status');
        statusDiv.innerHTML = '正在处理...';

        try {
          const result = await fillRegistrationForm();
          statusDiv.innerHTML = `注册信息已填写:<br>邮箱: ${result.email}<br>密码: ${result.password}`;

          // 刷新控制面板
          const existingPanel = document.getElementById(
            'augmentcode-auto-register-panel'
          );
          if (existingPanel) {
            existingPanel.remove();
          }
          const newPanel = createControlPanel();
          document.body.appendChild(newPanel);

          // 重新绑定事件
          bindEvents();
        } catch (error) {
          statusDiv.innerHTML = `错误: ${error}`;
        }
      });
    }

    // 添加获取邮件按钮事件
    const checkEmailsButton = document.getElementById('check-emails');
    if (checkEmailsButton) {
      checkEmailsButton.addEventListener('click', () =>
        checkAndDisplayEmails(false)
      );
    }

    // 添加自动处理验证按钮事件
    const autoVerifyButton = document.getElementById('auto-verify');
    if (autoVerifyButton) {
      autoVerifyButton.addEventListener('click', () => {
        const statusDiv = document.getElementById('register-status');

        // 检查当前页面是否有服务条款复选框
        const termsCheckbox = document.getElementById(
          'terms-of-service-checkbox'
        );

        if (termsCheckbox) {
          // 如果当前页面有服务条款复选框，自动勾选并点击注册按钮
          autoAcceptTermsAndSignUp();
        } else {
          // 如果当前页面没有服务条款复选框，则处理验证流程
          if (statusDiv)
            statusDiv.innerHTML =
              '当前页面没有服务条款复选框，尝试处理验证流程...';
          autoProcessVerification();
        }
      });
    }

    // 添加清除邮箱信息按钮事件
    const clearEmailButton = document.getElementById('clear-email');
    if (clearEmailButton) {
      clearEmailButton.addEventListener('click', () => {
        clearLastEmailData();

        // 刷新控制面板
        const existingPanel = document.getElementById(
          'augmentcode-auto-register-panel'
        );
        if (existingPanel) {
          existingPanel.remove();
        }
        const newPanel = createControlPanel();
        document.body.appendChild(newPanel);

        // 重新绑定事件
        bindEvents();

        // 更新状态
        const statusDiv = document.getElementById('register-status');
        if (statusDiv) {
          statusDiv.innerHTML = '邮箱信息已清除';
        }
      });
    }

    // 添加使用授权服务按钮事件
    const useAuthServiceButton = document.getElementById('use-auth-service');
    if (useAuthServiceButton) {
      useAuthServiceButton.addEventListener('click', async () => {
        const statusDiv = document.getElementById('register-status');
        statusDiv.innerHTML = '正在获取授权链接...';

        try {
          // 获取授权链接
          const authorizeUrl = await getAuthorizeUrl();
          statusDiv.innerHTML = '授权链接获取成功，正在跳转...';

          // 跳转到授权链接
          window.location.href = authorizeUrl;
        } catch (error) {
          console.error('获取授权链接失败:', error);
          statusDiv.innerHTML = `获取授权链接失败: ${error.message || error}`;
        }
      });
    }

    // 添加发送授权信息到服务器按钮事件
    const sendAuthDataButton = document.getElementById('send-auth-data');
    if (sendAuthDataButton) {
      sendAuthDataButton.addEventListener('click', async () => {
        const statusDiv = document.getElementById('register-status');
        statusDiv.innerHTML = '正在准备发送授权信息...';

        try {
          // 弹出输入框，让用户输入授权信息
          const authDataInput = prompt('请输入授权信息（JSON格式）:', '');

          if (!authDataInput) {
            statusDiv.innerHTML = '取消发送授权信息';
            return;
          }

          try {
            // 解析用户输入的 JSON
            const authData = JSON.parse(authDataInput);

            if (!authData.code || !authData.state) {
              statusDiv.innerHTML = '授权信息格式不正确，缺少 code 或 state';
              return;
            }

            // 发送授权信息到服务器
            statusDiv.innerHTML = '正在发送授权信息...';
            showAlert('正在发送授权信息...', 'info');

            const result = await sendCallbackData(
              authData.code,
              authData.state,
              authData.tenant_url || ''
            );

            console.log('授权信息发送成功:', result);
            statusDiv.innerHTML = '授权信息发送成功';
            showAlert('授权信息发送成功', 'success');
          } catch (parseError) {
            console.error('解析授权信息失败:', parseError);
            statusDiv.innerHTML = `解析授权信息失败: ${
              parseError.message || parseError
            }`;
          }
        } catch (error) {
          console.error('发送授权信息失败:', error);
          statusDiv.innerHTML = `发送授权信息失败: ${error.message || error}`;
        }
      });
    }

    // 绑定配置选项事件
    const autoCheckEmailCheckbox = document.getElementById('auto-check-email');
    if (autoCheckEmailCheckbox) {
      autoCheckEmailCheckbox.addEventListener('change', (e) => {
        config.autoCheckEmail = e.target.checked;
        console.log(`自动检查邮件已${e.target.checked ? '开启' : '关闭'}`);
      });
    }

    const autoFillCodeCheckbox = document.getElementById('auto-fill-code');
    if (autoFillCodeCheckbox) {
      autoFillCodeCheckbox.addEventListener('change', (e) => {
        config.autoFillVerificationCode = e.target.checked;
        console.log(`自动填写验证码已${e.target.checked ? '开启' : '关闭'}`);
      });
    }

    // 绑定使用授权服务开关
    const useAuthServiceToggle = document.getElementById(
      'use-auth-service-toggle'
    );
    if (useAuthServiceToggle) {
      useAuthServiceToggle.addEventListener('change', (e) => {
        config.useAuthService = e.target.checked;
        console.log(`使用授权服务已${e.target.checked ? '开启' : '关闭'}`);

        // 刷新控制面板以显示或隐藏授权服务按钮
        const existingPanel = document.getElementById(
          'augmentcode-auto-register-panel'
        );
        if (existingPanel) {
          existingPanel.remove();
        }
        const newPanel = createControlPanel();
        document.body.appendChild(newPanel);

        // 重新绑定事件
        bindEvents();
      });
    }

    // 如果启用了自动刷新邮件，添加定时器
    if (config.autoRefreshEmails) {
      // 清除现有定时器
      if (window.emailRefreshTimer) {
        clearInterval(window.emailRefreshTimer);
      }

      // 设置新定时器
      window.emailRefreshTimer = setInterval(() => {
        // 如果有邮箱信息且当前页面可见，自动刷新邮件
        const lastEmailData = getLastEmailData();
        if (lastEmailData && document.visibilityState === 'visible') {
          const statusDiv = document.getElementById('register-status');
          if (statusDiv && config.showRefreshStatus) {
            statusDiv.innerHTML = '自动刷新邮件中...';
          }

          // 静默刷新邮件，不显示完整列表
          checkAndDisplayEmails(true);
        }
      }, config.autoRefreshInterval);
    }
  }

  // 等待页面加载完成后执行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', main);
  } else {
    main();
  }
})();
