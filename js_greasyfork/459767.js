// ==UserScript==
// @name       vue-vite-tampermonkey
// @namespace  npm/vite-plugin-monkey
// @version    1.2
// @author     monkey
// @icon       https://vitejs.dev/logo.svg
// @include    /^https://www.google.com./
// @include    /^http?://leo.*/
// @include    /^https?://account.localdev.net/register*
// @include    /^https?://account.(.*sbo.*|.*top.*).com/register*
// @include    /^https?://account.sbo.top/register*/
// @include    /^https?://(www|m|play).(.*sbo.*|.*top.*).*.com/?$/
// @include    /^https?://(www|m|play).(.*sbo.*|.*top.*).*.com/??/
// @include    /^https?://(www|m|play).sbo.top/?$/
// @include    /^https?://(www|m|play).sbo.top/??/
// @include    /^https?://(www|m|play).sbo.top/??/
// @include    /^https?://dba-(stg|sb-prod).coreop.net.*/
// @include    /^https?://dragonballz.coreop.net.*/
// @include    /^https?://(stg.dino-pay|internal.drakonas).co/login.*/
// @require    https://cdn.jsdelivr.net/npm/vue@3.2.47/dist/vue.global.prod.js
// @require    https://cdn.jsdelivr.net/npm/axios@1.3.3/dist/axios.min.js
// @grant      GM_getValue
// @grant      GM_setValue
// @description 各種省時間的小東西
// @downloadURL https://update.greasyfork.org/scripts/459767/vue-vite-tampermonkey.user.js
// @updateURL https://update.greasyfork.org/scripts/459767/vue-vite-tampermonkey.meta.js
// ==/UserScript==

(t=>{const e=document.createElement("style");e.dataset.source="vite-plugin-monkey",e.innerText=t,document.head.appendChild(e)})('@import"https://fonts.googleapis.com/css2?family=Alfa+Slab+One&display=swap";.SboLoginButtonByCurrency[data-v-fc0e0e8c]{margin:0 12px;padding:.6em 2em;border:none;outline:none;color:#fff;background:#111;cursor:pointer;position:relative;z-index:0;border-radius:10px;user-select:none;-webkit-user-select:none;touch-action:manipulation}.SboLoginButtonByCurrency[data-v-fc0e0e8c]:before{content:"";background:linear-gradient(45deg,#ff0000,#ff7300,#fffb00,#48ff00,#00ffd5,#002bff,#7a00ff,#ff00c8,#ff0000);position:absolute;top:-2px;left:-2px;background-size:400%;z-index:-1;filter:blur(5px);-webkit-filter:blur(5px);width:calc(100% + 4px);height:calc(100% + 4px);animation:glowing-button-85-fc0e0e8c 20s linear infinite;transition:opacity .3s ease-in-out;border-radius:10px}@keyframes glowing-button-85-fc0e0e8c{0%{background-position:0 0}50%{background-position:400% 0}to{background-position:0 0}}.SboLoginButtonByCurrency[data-v-fc0e0e8c]:after{z-index:-1;content:"";position:absolute;width:100%;height:100%;background:#222;left:0;top:0;border-radius:10px}#SboLoginContainer[data-v-fc0e0e8c]{background-color:#fff;position:absolute;top:70px!important;left:0;width:100vw;display:flex;flex-direction:column;justify-content:center;align-items:center;padding:20px;height:400px}.selfAccount[data-v-fc0e0e8c]{margin-bottom:24px}.waviy[data-v-fc0e0e8c]{user-select:none;text-align:center;margin-bottom:16px;color:#02db9d;position:relative;-webkit-box-reflect:below -20px linear-gradient(transparent,rgba(0,0,0,.2));font-size:24px}.waviy span[data-v-fc0e0e8c]{font-family:Alfa Slab One,cursive;position:relative;display:inline-block;color:#7a7a3d;animation:waviy-fc0e0e8c 1s infinite;animation-delay:calc(.1s * var(--i))}@keyframes waviy-fc0e0e8c{0%,40%,to{transform:translateY(0)}20%{transform:translateY(-10px)}}#TamperMonkeyContainer{position:absolute;left:0;top:0;z-index:9999}');

(function(vue, axios2) {
  "use strict";
  const ValidateUrl = (site) => {
    const { URL } = document;
    return URL.includes(site);
  };
  const ElementById = (id) => {
    return document.getElementById(id);
  };
  const ElementByClass = (className) => {
    return document.querySelector(`${className}`);
  };
  const SetCookie = (name, value, domain = "/") => {
    const Days = 30;
    const exp = new Date();
    exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1e3);
    document.cookie = name + "=" + escape(value) + ";domain=" + domain;
  };
  const GetCookie = (name) => {
    let arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg)) {
      return unescape(arr[2]);
    } else {
      return null;
    }
  };
  const useFetch = async (url, req) => {
    return await (await fetch(url, req)).json();
  };
  var monkeyWindow = window;
  var GM_setValue = /* @__PURE__ */ (() => monkeyWindow.GM_setValue)();
  var GM_getValue = /* @__PURE__ */ (() => monkeyWindow.GM_getValue)();
  const InitProfileDto = () => {
    GM_setValue("FirstName", "_____YOUR_FIRSTNAME_LIKE__jack__");
    GM_setValue("LastName", "_____YOUR_LASTNAME_LIKE__huang__");
    GM_setValue("ID", "_____YOUR_ID_LIKE__85__");
    GM_setValue("Password", "_____YOUR_PASSWORD_____");
    GM_setValue("SimplePassword", "1234qwer");
  };
  const originProfile = {
    FirstName: GM_getValue("FirstName", "").toLowerCase(),
    LastName: GM_getValue("LastName", "").toLowerCase(),
    ID: GM_getValue("ID", ""),
    Password: GM_getValue("Password", ""),
    SimplePassword: GM_getValue("SimplePassword", ""),
    AccountName: "",
    // jackhuang
    AccountNameWithT: "",
    // tjackhuang
    AccountNameWithNumber: "",
    // jack.huang85
    AccountNameSortWithT: "",
    //tjack
    Email: "",
    UserNameInput: HTMLInputElement,
    PasswordInput: HTMLInputElement
  };
  const GenerateProfileDto = () => {
    const FN = originProfile.FirstName;
    const LN = originProfile.LastName;
    const ID = originProfile.ID;
    originProfile.AccountName = `${FN}${LN}`;
    originProfile.AccountNameWithT = `t${FN}${LN}`;
    originProfile.AccountNameWithNumber = `${FN}.${LN}${ID}`;
    originProfile.AccountNameSortWithT = `t${FN}`;
    originProfile.Email = `${FN}.${LN}@titansoft.com.sg`;
  };
  const ProfileDto = () => {
    GenerateProfileDto();
    return originProfile;
  };
  const ValidateVariableIsSet = () => {
    const needValidateVariable = ["FirstName", "LastName", "ID", "Password"];
    for (const variable of needValidateVariable) {
      if (GM_getValue(variable, "").match(`_____YOUR_${variable.toUpperCase()}`)) {
        alert(`Please Set Your Current [${variable}] in Tampermonkey Script`);
        return false;
      }
    }
    return true;
  };
  const profile$5 = ProfileDto();
  const TrexDinoLogin = async (isStaging) => {
    const LoginData = {
      Username: profile$5.AccountNameSortWithT,
      Password: isStaging ? profile$5.SimplePassword : profile$5.Password,
      authCode: isStaging ? "123" : ElementById("AuthCode").value
    };
    const result = await useFetch("/api/v1/login", {
      method: "POST",
      body: JSON.stringify(LoginData),
      headers: {
        "content-type": "application/json"
      }
    });
    if (result.status === 1) {
      localStorage.setItem("t", result.data.token);
      localStorage.setItem("ro", result.data.roles);
      localStorage.setItem("name", result.data.name);
      localStorage.setItem("group", result.data.group);
      localStorage.setItem("mc", result.data.merchantCode);
      location.href = "/welcome";
    }
  };
  const TrexDino = async () => {
    const WarningText = "!!!!! Just Need To Input Auth Code !!!!!";
    profile$5.UserNameInput = ElementById("UserName");
    profile$5.PasswordInput = ElementById("loginPassword");
    profile$5.UserNameInput.setAttribute("placeholder", WarningText);
    profile$5.PasswordInput.setAttribute("placeholder", WarningText);
    const isStaging = ValidateUrl("dino-pay");
    const AuthCodeInput = ElementById("AuthCode");
    await TrexDinoLogin(isStaging);
    if (isStaging)
      return;
    AuthCodeInput.focus();
    AuthCodeInput.addEventListener("keyup", async (e) => {
      if (AuthCodeInput.value.length === 6) {
        await TrexDinoLogin(isStaging);
      }
    });
  };
  const profile$4 = ProfileDto();
  const Leo = () => {
    profile$4.UserNameInput = ElementById("txtUsername");
    profile$4.PasswordInput = ElementById("txtPassword");
    profile$4.UserNameInput.value = profile$4.AccountNameWithT;
    profile$4.PasswordInput.value = profile$4.Password;
    ElementById("btnLogin").click();
  };
  const profile$3 = ProfileDto();
  const DragonBallz = () => {
    profile$3.UserNameInput = ElementByClass('input[name="username"]');
    profile$3.PasswordInput = ElementByClass('input[name="password"]');
    if (profile$3.UserNameInput) {
      profile$3.UserNameInput.value = profile$3.AccountNameWithNumber;
      profile$3.PasswordInput.value = profile$3.Password;
      document.querySelector(".form-signin").submit();
    } else {
      const ProjectInput = ElementByClass('input[type="search"]');
      const SearchInput = ElementById("colFormLabel");
      ProjectInput.focus();
      ElementByClass('input[type="search"]').addEventListener("blur", (e) => {
        SearchInput.focus();
      });
    }
  };
  const profile$2 = ProfileDto();
  const ArtemisLogin = async () => {
    const requestToken = ElementByClass('input[name="__RequestVerificationToken"]');
    const formData = new FormData();
    formData.append("__RequestVerificationToken", requestToken.value);
    formData.append("username", profile$2.AccountNameWithNumber);
    formData.append("password", profile$2.Password);
    formData.append("action", "Login");
    const result = await fetch("/", {
      method: "post",
      body: formData
    });
    const HTMLText = await result.text();
    switch (true) {
      case HTMLText.includes("/Developer/Query"):
        location.href = result.url;
        break;
      case HTMLText.includes("otp"):
        document.body.innerHTML = HTMLText;
        break;
      case HTMLText.includes("Account/Password is not valid."):
        alert("Login Fail");
        throw new Error("Login Fail");
    }
  };
  const autoFocus = () => {
    const DBList = ElementById("searchDB");
    const TableList = ElementById("searchTable");
    const InsertButton = ElementById("insert");
    const SubmitButton = ElementById("btnSubmit");
    document.addEventListener("keydown", (e) => {
      if (e.ctrlKey) {
        switch (e.key) {
          case ",":
            DBList.focus();
            break;
          case ".":
            TableList.focus();
            break;
        }
      }
    });
    DBList.focus();
    setTimeout(() => {
    }, 2e3);
    DBList.addEventListener("focus", () => {
      DBList.value = "";
      TableList.value = "";
    });
    TableList.addEventListener("focus", () => TableList.value = "");
    DBList.addEventListener("change", (e) => {
      TableList.focus();
      TableList.value = "";
    });
    TableList.addEventListener("change", () => {
      if (DBList.value && TableList.value) {
        setTimeout(() => {
          TableList.blur();
          InsertButton.click();
          SubmitButton.click();
        }, 350);
      }
    });
  };
  const Artemis = async () => {
    const LoginButton = ElementById("login");
    profile$2.UserNameInput = ElementById("username");
    profile$2.PasswordInput = ElementById("password");
    if (LoginButton) {
      await ArtemisLogin();
    }
    if (ValidateUrl("Query")) {
      autoFocus();
    }
  };
  const _sfc_main$3 = /* @__PURE__ */ vue.defineComponent({
    __name: "AutoLogin",
    setup(__props) {
      const selectCurrentSite = () => {
        if (!ValidateVariableIsSet()) {
          return;
        }
        switch (true) {
          case ValidateUrl("dragonballz"):
            DragonBallz();
            break;
          case ValidateUrl("dba"):
            Artemis();
            break;
          case ValidateUrl("leo"):
            Leo();
            break;
          case ValidateUrl("drakonas"):
          case ValidateUrl("dino-pay"):
            TrexDino();
            break;
        }
      };
      vue.onMounted(() => {
        console.log("AutoLogin Start");
        setTimeout(() => {
          selectCurrentSite();
        }, 100);
      });
      return (_ctx, _cache) => {
        return null;
      };
    }
  });
  const CurrencyWithCountryCodeList = [
    { currency: "vnd", countryCode: "VN" },
    { currency: "idr", countryCode: "ID" },
    { currency: "inr", countryCode: "IN" },
    { currency: "thb", countryCode: "TH" },
    { currency: "myr", countryCode: "MY" },
    { currency: "cny", countryCode: "CN" },
    { currency: "krw", countryCode: "KR" },
    { currency: "mmk", countryCode: "MM" },
    { currency: "jpy", countryCode: "JP" },
    { currency: "UST", countryCode: "JP" },
    { currency: "iom", countryCode: "IM" }
  ];
  const profile$1 = ProfileDto();
  const GenerateNameListWithCurrency = () => {
    const date = new Date();
    const year = date.getFullYear() - 2e3;
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const CurrencyListWithName = [];
    for (const data of CurrencyWithCountryCodeList) {
      const obj = {
        loginName: profile$1.AccountNameSortWithT + data.currency + year + month,
        currency: data.currency,
        countryCode: data.countryCode
      };
      CurrencyListWithName.push(obj);
    }
    return CurrencyListWithName;
  };
  const GenerateUniversalAccountList = () => {
    const UniversalList = [];
    for (const data of CurrencyWithCountryCodeList) {
      const prefix = `t${data.currency === "usdt" ? "univer" : "universal"}`;
      const obj = {
        loginName: `${prefix}${data.currency}1`,
        currency: data.currency,
        countryCode: data.countryCode
      };
      UniversalList.push(obj);
    }
    return UniversalList;
  };
  const getHectorApiUrl = () => {
    const HttpProtocal = location.protocol;
    const siteType2 = location.hostname.split(".")[1];
    return `${HttpProtocal}//api-home.${siteType2}.com`;
  };
  const Login = async (loginName, currency = "", countryCode, password = profile$1.SimplePassword) => {
    const Fingerprint = ElementById("Fingerprint");
    const DeviceTag = ElementById("DeviceTag");
    const LoginRequest = {
      loginName,
      password,
      fingerprint: Fingerprint.value,
      tzDiff: "0",
      shower: location.href,
      deviceTag: DeviceTag.value,
      loginFrom: "Unknown",
      language: "en-US",
      product: "Sports",
      isMobile: false,
      currency,
      countryCode
    };
    const isOauthLoginEnable = await CheckEnableOAuthLogin(loginName);
    if (!isOauthLoginEnable) {
      await SingoutRequest();
      await FetchLoginRequest(LoginRequest);
    }
  };
  const CheckEnableOAuthLogin = async (loginName) => {
    const response = await axios2.post(`${getHectorApiUrl()}/api/Login/CheckEnableOAuthLogin`, {
      loginName
    });
    return response.isOauthLoginEnable;
  };
  const SingoutRequest = async () => {
    return await axios2.get(`${getHectorApiUrl()}/signout-sbo`);
  };
  const FetchLoginRequest = async (LoginDto) => {
    const CSRFToken = ElementById("CSRFTokenForm");
    const result = await axios2.post("/api/Login/Login", LoginDto, {
      headers: {
        requestverificationtoken: CSRFToken.value
      }
    });
    switch (result.data.status) {
      case "LoginSuccess":
        location.href = result.data.redirectUrl;
        break;
      case "GeneralLoginFailure":
      case "LoginIsBlocked":
        const isConfirm = confirm(`Login Fail
Status:: ${result.data.status}
Error Message:: ${result.data.errorMessage}

Click [OK] to redirect to register page`);
        if (isConfirm) {
          SetCookie("currency", LoginDto.currency, GetHectorRegisterDomain());
          SetCookie("countryCode", LoginDto.countryCode, GetHectorRegisterDomain());
          location.href = GetHectorRegisterApiUrl();
        }
        break;
    }
  };
  const profile = ProfileDto();
  const randomAccount = "tjackusdt" + Math.floor(Math.random() * 100);
  const siteType = location.hostname.split(".")[1];
  const GetHectorRegisterApiUrl = () => {
    const HttpProtocol = location.protocol;
    return `${HttpProtocol}//account.${siteType}.com/register`;
  };
  const GetHectorRegisterDomain = () => `${siteType}.com`;
  let __RequestVerificationToken;
  let RefNo;
  const currentAccountDataByCurrency = GenerateNameListWithCurrency().filter((n) => n.currency === GetCookie("currency"))[0];
  const GetRequestToken = async () => {
    const TokenInputElement = document.getElementsByName("__RequestVerificationToken")[0];
    __RequestVerificationToken = TokenInputElement.value;
  };
  const GetRefNo = () => {
    const RefNoElement = document.getElementById("RefNo");
    RefNo = RefNoElement.textContent;
  };
  const CheckLoginNameAvailability = async () => {
    const formData = new FormData();
    formData.append("__RequestVerificationToken", __RequestVerificationToken);
    formData.append("loginName", randomAccount);
    const { data: result } = await axios2.post(`${GetHectorRegisterApiUrl()}/CheckLoginNameAvailability`, formData);
    return !result.suggestions;
  };
  const GenerateRegisterRequest = () => {
    let year = new Date().getFullYear().toString().substr(-2);
    let month = new Date().getMonth() + 1;
    let day = new Date().getDate();
    let randomNumber = Math.floor(Math.random() * 100);
    const formData = new FormData();
    formData.append("AccountInfo[LoginName]", randomAccount);
    formData.append("AccountInfo[Password]", profile.SimplePassword);
    formData.append("AccountInfo[RefNo]", RefNo);
    formData.append("AccountInfo[BTag]", "");
    formData.append("AccountInfo[Currency]", currentAccountDataByCurrency.currency.toUpperCase());
    formData.append("PersonalInfo[FirstName]", profile.FirstName.toUpperCase());
    formData.append("PersonalInfo[LastName]", "Test");
    formData.append("PersonalInfo[NoLastName]", "false");
    formData.append("PersonalInfo[Day]", "01");
    formData.append("PersonalInfo[Month]", "01");
    formData.append("PersonalInfo[Year]", "1989");
    formData.append("PersonalInfo[Email]", profile.Email);
    formData.append("PersonalInfo[Mobile]", `66-912345678${year}${month}${day}${randomNumber}`);
    formData.append("PersonalInfo[ContactPreference]", "");
    formData.append("PersonalInfo[NationalityCode]", "");
    formData.append("PersonalInfo[ResidentCountryCode]", currentAccountDataByCurrency.countryCode.toUpperCase());
    formData.append("PersonalInfo[PromotionCode]", "");
    formData.append("PersonalInfo[PromotionEmail]", "false");
    formData.append("PersonalInfo[Gender]", "");
    formData.append("Language", "EN");
    formData.append("SecurityQuestionId", "8");
    formData.append("SecurityAnswer", "Answer");
    formData.append("BrandRedirection[IsFromBet]", "false");
    formData.append("BrandRedirection[TestGroup]", "");
    formData.append("Platform", "d");
    return formData;
  };
  const AutoRegister = async () => {
    GetRefNo();
    await GetRequestToken();
    GenerateRegisterRequest();
    const CheckLoginName = await CheckLoginNameAvailability();
    if (CheckLoginName) {
      GenerateRegisterRequest();
    }
  };
  const _hoisted_1 = {
    key: 0,
    id: "SboLoginContainer"
  };
  const _hoisted_2 = { class: "selfAccount" };
  const _hoisted_3 = { class: "waviy" };
  const _hoisted_4 = ["onClick"];
  const _hoisted_5 = { class: "universalAccount" };
  const _hoisted_6 = { class: "waviy" };
  const _hoisted_7 = ["onClick"];
  const _sfc_main$2 = /* @__PURE__ */ vue.defineComponent({
    __name: "SboLoginButton",
    setup(__props) {
      const LoginListByCurrency = vue.reactive(GenerateNameListWithCurrency());
      const PermanentAccountList = vue.reactive(GenerateUniversalAccountList());
      vue.onMounted(async () => {
      });
      return (_ctx, _cache) => {
        return vue.unref(ValidateUrl)("www.sbo") ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_1, [
          vue.createElementVNode("div", _hoisted_2, [
            vue.createElementVNode("div", _hoisted_3, [
              vue.createTextVNode(" ※※ "),
              (vue.openBlock(), vue.createElementBlock(vue.Fragment, null, vue.renderList(["Your", "Account", "in", "this", "month"], (item, index) => {
                return vue.createElementVNode("span", {
                  style: vue.normalizeStyle(`--i: ${index + 1}`)
                }, vue.toDisplayString(" " + item), 5);
              }), 64)),
              vue.createTextVNode(" ※※ ")
            ]),
            (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(vue.unref(LoginListByCurrency), (item, index) => {
              return vue.openBlock(), vue.createElementBlock("button", {
                class: "SboLoginButtonByCurrency",
                key: index,
                onClick: ($event) => vue.unref(Login)(item.loginName, item.currency, item.countryCode)
              }, vue.toDisplayString(item.currency.toUpperCase()), 9, _hoisted_4);
            }), 128))
          ]),
          vue.createElementVNode("div", _hoisted_5, [
            vue.createElementVNode("div", _hoisted_6, [
              vue.createTextVNode(" ※※ "),
              (vue.openBlock(), vue.createElementBlock(vue.Fragment, null, vue.renderList(["Permanent", "Universal", "Account"], (item, index) => {
                return vue.createElementVNode("span", {
                  style: vue.normalizeStyle(`--i: ${index + 1}`)
                }, vue.toDisplayString(" " + item), 5);
              }), 64)),
              vue.createTextVNode(" ※※ ")
            ]),
            (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(vue.unref(PermanentAccountList), (item, index) => {
              return vue.openBlock(), vue.createElementBlock("button", {
                class: "SboLoginButtonByCurrency",
                key: index,
                onClick: ($event) => vue.unref(Login)(item.loginName, item.currency, item.countryCode)
              }, vue.toDisplayString(item.currency.toUpperCase()), 9, _hoisted_7);
            }), 128))
          ])
        ])) : vue.createCommentVNode("", true);
      };
    }
  });
  const SboLoginButton_vue_vue_type_style_index_0_scoped_fc0e0e8c_lang = "";
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const SboLoginButton = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-fc0e0e8c"]]);
  const _sfc_main$1 = /* @__PURE__ */ vue.defineComponent({
    __name: "SboAutoRegister",
    setup(__props) {
      vue.onMounted(async () => {
        await AutoRegister();
      });
      return (_ctx, _cache) => {
        return null;
      };
    }
  });
  const _sfc_main = /* @__PURE__ */ vue.defineComponent({
    __name: "App",
    setup(__props) {
      vue.onMounted(() => {
        InitProfileDto();
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock(vue.Fragment, null, [
          vue.createVNode(_sfc_main$3),
          vue.unref(ValidateUrl)("www.sbo") ? (vue.openBlock(), vue.createBlock(SboLoginButton, { key: 0 })) : vue.createCommentVNode("", true),
          vue.unref(ValidateUrl)(vue.unref(GetHectorRegisterApiUrl)()) ? (vue.openBlock(), vue.createBlock(_sfc_main$1, { key: 1 })) : vue.createCommentVNode("", true)
        ], 64);
      };
    }
  });
  const App_vue_vue_type_style_index_0_lang = "";
  const app = vue.createApp(_sfc_main);
  app.mount(
    (() => {
      const Container = document.createElement("div");
      Container.id = "TamperMonkeyContainer";
      document.body.append(Container);
      return Container;
    })()
  );
})(Vue, axios);
