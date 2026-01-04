// ==UserScript==
// @name        TC dev enhance
// @name:zh-CN  TC开发增强
// @name:zh-TW  TC開發增强
// @license     MIT
// @namespace   Violentmonkey Scripts
// @homepageURL https://github.com/kikyous/tc-dev-enhance
// @match       *://localhost:5000/*
// @match       *://lms-stg.tronclass.com.cn/*
// @match       *://lms-qa.tronclass.com.cn/*
// @match       *://lms-product.tronclass.com.cn/*
// @match       *://lms-university.tronclass.com.cn/*
// @match       *://lms-university-fmmu.tronclass.com.cn/*
// @noframes
// @version     2.6
// @author      chen
// @description Switch TC accounts conveniently
// @description:zh-CN 快速切换TC账号
// @description:zh-TW 快速切換TC帳號
// @grant GM.registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/476156/TC%20dev%20enhance.user.js
// @updateURL https://update.greasyfork.org/scripts/476156/TC%20dev%20enhance.meta.js
// ==/UserScript==


const logout = () => {
    return fetch("/api/logout", {
        headers: { "content-type": "application/json;charset=UTF-8" },
        body: JSON.stringify({}),
        method: "POST",
    }).catch(() => true);
};

const login = (username, password, orgId = '', credentials = 'same-origin') => {
    const data = {
        user_name: username,
        password: password,
        remember: true,
    };
    if (orgId) {
        data.org_id = orgId;
    }
    return fetch("/api/login", {
        headers: { "content-type": "application/json;charset=UTF-8" },
        credentials: credentials,
        body: JSON.stringify(data),
        method: "POST",
    }).then(async function (response) {
        if (!response.ok) {
            throw (await response.json());
        }
        return response.json();
    });
};




const style = `
*, *:before, *:after {
    box-sizing: border-box;
}
:host {
    font-size: 13px;
}

.user-input {
    color: red;
    border: 1px solid #cbcbcb;
    border-radius: 2px;
    outline: none;
    padding: 1px 4px;
    width: 100%;
    background: rgba(0, 0, 0, 0);
}

form {
    margin: 0
}

.orgs-wrapper label {
    margin: 8px 0;
    line-height: 1;
    display: flex;
    align-items: center;
}

.orgs-wrapper input {
    margin: 0 5px;
}

.orgs-wrapper {
    background: white;
    border: 1px solid #cbcbcb;
    padding: 0 5px;
    border-radius: 2px;
}

.info {
    background: white;
    border-radius: 2px;
    border: 1px solid #cbcbcb;
    padding: 3px 10px;
}

:host(.error) .user-input, :host(.error) .user-input:focus {
  border: red solid 2px;
}

.slide-in-top {
	animation: slide-in-top 0.3s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
}

@keyframes slide-in-top {
  0% {
    transform: translateY(-1000px);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes linearGradientMove {
    100% {
        background-position: 4px 0, -4px 100%, 0 -4px, 100% 4px;
    }
}

:host(.loading) .user-input  {
    background:
        linear-gradient(90deg, red 50%, transparent 0) repeat-x,
        linear-gradient(90deg, red 50%, transparent 0) repeat-x,
        linear-gradient(0deg, red 50%, transparent 0) repeat-y,
        linear-gradient(0deg, red 50%, transparent 0) repeat-y;
    background-size: 4px 1px, 4px 1px, 1px 4px, 1px 4px;
    background-position: 0 0, 0 100%, 0 0, 100% 0;
    animation: linearGradientMove .3s infinite linear;
}
`;


customElements.define('enhance-input', class extends HTMLElement {
    constructor() {
        super();
        const value = unsafeWindow.globalData?.user?.userNo || unsafeWindow.statisticsSettings?.user?.userNo || ''

        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.innerHTML = `
            <style>${style}</style>
            <form>
                <input class='user-input' name='user_name' autocomplete="on" onfocus="this.select()" value="${value}" type=text />
            </form>
        `;

        const form = shadowRoot.querySelector("form");
        const input = shadowRoot.querySelector("input");

        form.addEventListener("submit", (event) => {
            event.preventDefault()
            this.submit(input.value)
        })
    }

    showInfo(message) {
        this.shadowRoot.querySelector('.info')?.remove();
        const div = document.createElement("div");
        div.classList.add('info', 'slide-in-top')
        this.shadowRoot.appendChild(div);
        div.innerText = message
        setTimeout(() => {
            div.remove()
        }, 5000);
    }

    selectOrgIfNeeded(result) {
        const form = this.shadowRoot.querySelector('form');
        this.shadowRoot.querySelector('.orgs-wrapper')?.remove()

        return new Promise((resolve) => {
            const orgs = result.orgs;
            if (orgs) {
                const orgsHtml = orgs.map((org) => {
                    return `<label><input type="radio" name="org" value="${org.id}"> <span> ${org.name} </span> </label>`
                }).join('')
                form.insertAdjacentHTML('beforeend', `<div class="orgs-wrapper slide-in-top">${orgsHtml}</div>`)
                form.querySelectorAll('.orgs-wrapper input[type="radio"]').forEach((radio) => {
                    radio.addEventListener('change', (event) => {
                        resolve({ org_id: event.target.value })
                    })
                })
            } else {
                resolve(result)
            }
        })
    }

    submit(value) {
        if (!value) {
            return
        }

        let [username, password] = value.split(' ')
        if (!password) {
            password = localStorage.getItem('__pswd') || 'password'
        }
        const logoutAndLogin = (result) => {
            return logout()
                .then(() => login(username, password, result['org_id']))
                .then(() => {
                    window.location.reload();
                })
        }

        this.shadowRoot.querySelector('.orgs-wrapper')?.remove()
        this.classList.remove('error');
        this.classList.add('loading');


        const testLogin = () => {
            return login(username, password, '', 'omit').then((result) => {
                localStorage.setItem('__pswd', password);
                return result
            }).catch((result) => {
                const errors = result.errors || {};
                this.showInfo(errors['user_name']?.at(0) || errors['password']?.at(0));
                throw new Error('login failed');
            })
        }

        // test account then logout
        testLogin().then(this.selectOrgIfNeeded.bind(this)).then(logoutAndLogin).catch(() => {
            this.classList.add("error");
            this.classList.remove('loading');
        })
    }
});

const inject = (node) => {
    node.insertAdjacentHTML(
        "afterbegin",
        `<enhance-input style='width: 120px; position: fixed; top: 0; right: 0; z-index: 9999;'></enhance-input>`
    );
};

inject(document.body);


GM.registerMenuCommand('临时隐藏/显示登录输入框', () => {
    const input = document.querySelector('enhance-input')
    if (input) {
        input.remove()
    } else {
        inject(document.body)
    }
})


fetch('/d/version').then(res => res.text()).then(result => {
    const buildIndex = result.match(/^\d+\.\d+\.(\w+)/)[1]
    document.title = `[${buildIndex}] ` + document.title
})