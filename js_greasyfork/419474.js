// ==UserScript==
// @name               Crack Forclass 4
// @namespace          https://www.forclass.tk/script?4
// @version            3.1.7
// @icon               https://houtar.coding.net/p/crackForclass/d/crackForclass/git/raw/master/icon.png
// @description        这同样适用于 Forclass,Sunclass,271BAY,Zhizhiniao
// @author             Houtarchat
// @match              *://*.forclass.net/Account/SignIn*
// @contributionURL    https://www.houtarchat.ml/donate.html
// @contributionAmount 5 RMB
// @license            GNU General Public License
// @grant              GM.xmlHttpRequest
// @grant              GM_getValue
// @grant              GM_setValue
// @connect            zhizhiniao.com
// @run-at             document-end
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/419474/Crack%20Forclass%204.user.js
// @updateURL https://update.greasyfork.org/scripts/419474/Crack%20Forclass%204.meta.js
// ==/UserScript==
(() => {
    /* jslint browser: true */
    /* global window */
    /* global GM */

    if (sessionStorage.account) {
        return;
    }
    const loginOut = `
<div data-v-11cfcce0="" class="login-tables">
  <table data-v-11cfcce0="" class="logintb">
    <tr data-v-11cfcce0="">
      <td data-v-11cfcce0="">
        <div data-v-11cfcce0="" class="trdiv">
          <div data-v-11cfcce0="" class="logtrlabel nosel">用户名</div>
          <input
            data-v-11cfcce0=""
            type="text"
            id="login-name"
            class="loginput-c"
          />
        </div>
      </td>
    </tr>
    <tr data-v-11cfcce0="">
      <td data-v-11cfcce0="">
        <div data-v-11cfcce0="" class="trdiv">
          <div data-v-11cfcce0="" class="logtrlabel nosel">密　码</div>
          <input
            data-v-11cfcce0=""
            type="password"
            id="login-pwd"
            class="loginput-c"
          />
        </div>
      </td>
    </tr>
    <tr data-v-11cfcce0="">
      <td data-v-11cfcce0="">
        <div data-v-11cfcce0="" class="errmsg loginmsg"></div>
      </td>
    </tr>
    <tr data-v-11cfcce0="">
      <td data-v-11cfcce0="">
        <div data-v-11cfcce0="" class="logattachinfo nosel">
          <div data-v-11cfcce0="" class="autologin nosel">
            <input
              data-v-11cfcce0=""
              type="checkbox"
              id="rembox"
              class="regular-checkbox"
            /><label data-v-11cfcce0="" for="rembox" class="remlabel"></label>
            <label data-v-11cfcce0="" for="rembox" class="autologtxt"
              >记住账号密码</label
            >
          </div>
        </div>
      </td>
    </tr>
    <tr data-v-11cfcce0="">
      <td data-v-11cfcce0="">
        <div data-v-11cfcce0="" class="loginoperation nosel">
          <div data-v-11cfcce0="" class="loginbtnc btnlogin">登 录</div>
        </div>
      </td>
    </tr>
  </table>
</div>
`;

    Pace.on("done", () => {
        document.getElementsByClassName('login-out')[0].innerHTML = loginOut;
        let loginName = document.getElementById("login-name");
        let loginPwd = document.getElementById("login-pwd");
        let remBox = document.getElementById('rembox');
        let loginMsg = document.getElementsByClassName('loginmsg')[0];
        loginName.value = GM_getValue('account', '');
        loginPwd.value = GM_getValue('password', '');
        document.getElementsByClassName('btnlogin')[0].addEventListener('click', () => {
            if (remBox.checked) {
                GM_setValue('account', loginName.value);
                GM_setValue('password', loginPwd.value);
            }
            loginMsg.innerText = '登录中...'
            GM.xmlHttpRequest({
                method: 'POST',
                url: `${location.protocol}//www.zhizhiniao.com/ANAService.asmx/LoginAccountJson`,
                data: JSON.stringify({
                    session: null,
                    page: 0,
                    account: loginName.value,
                    password: loginPwd.value
                }),
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                },
                onload({responseText}) {
                    if ((JSON.parse(responseText))['ReturnText']) {
                        loginMsg.innerText = (JSON.parse(responseText))['ReturnText'];
                    } else {
                        loginMsg.innerText = '登录成功';
                        const ifr = document.createElement('iframe');
                        ifr.setAttribute(
                            'src',
                            `${location.protocol}//account.sun.forclass.net/Account/SignIn?session=${JSON.parse(responseText).result?.[0].session ?? ''}`
                        );
                        document.head.appendChild(ifr);

                        ifr.onload = () => window.location.href = `${location.protocol}//zzn.sun.forclass.net/Student/WdzySun`;
                    }
                },
            });
        });
    });

})();
