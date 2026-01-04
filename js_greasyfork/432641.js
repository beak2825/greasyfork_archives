// ==UserScript==
// @name            Xior_Helper
// @namespace       https://blog.chrxw.com
// @supportURL      https://blog.chrxw.com/scripts.html
// @contributionURL https://afdian.net/@chr233
// @version         1.8
// @description     略
// @author          Chr_
// @icon            https://blog.chrxw.com/favicon.ico
// @match           https://www.xior-booking.com/*
// @match           https://xior-booking.com/*
// @connect         qmsg.zendee.cn
// @grant           GM_addStyle
// @grant           GM_setValue
// @grant           GM_getValue
// @grant           GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/432641/Xior_Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/432641/Xior_Helper.meta.js
// ==/UserScript==

(() => {
    'use strict';

    let Gsettings = GM_getValue('Gsettings') ?? {};

    // let Ghistory = GM_getValue('Ghistory') ?? [];

    if (window.location.pathname === '/') {
        setTimeout(() => {
            let frmCountry = document.getElementById('country');
            let frmCity = document.getElementById('city');
            let frmLocation = document.getElementById('location');
            let frmSpaceType = document.getElementById('space_type');
            let frmMinPrice = document.getElementById('minPrice');
            let frmMaxPrice = document.getElementById('maxPrice');
            let frmMinSurface = document.getElementById('minSurface');
            let frmMaxSurface = document.getElementById('maxSurface');
            let frmOrder = document.getElementById('order');
            let frmCodeMark = document.getElementById('code_mark');

            let btnSaveFilter = genBtn('储存搜索设置', () => {
                Object.assign(Gsettings, {
                    country: frmCountry.value,
                    city: frmCity.value,
                    location: frmLocation.value,
                    spaceType: frmSpaceType.value,
                    minPrice: frmMinPrice.value,
                    maxPrice: frmMaxPrice.value,
                    minSurface: frmMinSurface.value,
                    maxSurface: frmMaxSurface.value,
                    order: frmOrder.value,
                    codeMark: frmCodeMark.value,
                });
                GM_setValue('Gsettings', Gsettings);
                alert('过滤器已保存');
            });

            let btnLoadFilter = genBtn('加载搜索设置', () => {
                Gsettings = GM_getValue('Gsettings') ?? {};

                const {
                    country, city, location, spaceType,
                    minPrice, maxPrice, minSurface,
                    maxSurface, order, codeMark,
                } = Gsettings;

                frmCity.value = city ?? '';
                frmCountry.value = country ?? '';
                frmLocation.value = location ?? '';
                frmSpaceType.value = spaceType ?? '';
                frmMinPrice.value = minPrice ?? '';
                frmMaxPrice.value = maxPrice ?? '';
                frmMinSurface.value = minSurface ?? '';
                frmMaxSurface.value = maxSurface ?? '';
                frmOrder.value = order ?? '';
                frmCodeMark.value = codeMark ?? '';
            });

            let {
                autoSearch, autoSearchInterval,
                autoReload, autoReloadInterval,
                skey
            } = Gsettings;

            let btnManualSearch = genBtn('手动搜索', reSearch);

            let txtAutoSearch = genInput(autoSearchInterval ?? '', '刷新间隔(秒)', true);
            let btnAutoSearch = genBtn(bool2str(autoSearch) + '自动搜索', () => {
                try {
                    let interval = parseFloat(txtAutoSearch.value);
                    if (interval < 3) { throw new Error(); }
                    if (interval != interval) { throw new Error(); }
                    autoSearchInterval = interval;
                } catch (e) {
                    if (!autoSearch) {
                        alert('请输入正确的搜索时间, 搜索时间 >= 3 秒');
                        txtAutoSearch.focus();
                        return;
                    }
                }
                autoSearch = !autoSearch;
                btnAutoSearch.textContent = bool2str(autoSearch) + '自动搜索';
                Gsettings.autoSearch = autoSearch;
                Gsettings.autoSearchInterval = autoSearchInterval
                GM_setValue('Gsettings', Gsettings);

                let urls = [];

                let task = () => {
                    reSearch();
                    setTimeout(() => {
                        let result = checkItems();
                        if (result.length > 0) {
                            for (let { title, desp, area, price, url } of result) {
                                console.log(`${title}\n- ${desp}\n- ${area} ${price}\n- ${url}`);
                            }

                            let { url } = result[0];
                            if (!urls.includes(url)) {
                                urls.push(url);
                                window.open(url);
                            }

                            sendQmsg(skey, '搜索有结果了');
                        }
                    }, 500);
                    if (autoSearch) {
                        setTimeout(task, autoSearchInterval * 1000);
                    }
                }
                if (autoSearch) {
                    setTimeout(task, autoSearchInterval * 1000);
                }
            });

            let txtAutoReload = genInput(autoReloadInterval ?? '', '刷新间隔(秒)', true);
            txtAutoReload.min = 10;
            let btnAutoReload = genBtn(bool2str(autoReload) + '自动刷新', () => {
                try {
                    let interval = parseFloat(txtAutoReload.value);
                    if (interval < 10) { throw new Error(); }
                    if (interval != interval) { throw new Error(); }
                    autoReloadInterval = interval;
                } catch (e) {
                    if (!autoReload) {
                        alert('请输入正确的刷新时间, 刷新时间 >= 10 秒');
                        txtAutoReload.focus();
                        return;
                    }
                }
                autoReload = !autoReload;
                btnAutoReload.textContent = bool2str(autoReload) + '自动刷新';
                Gsettings.autoReload = autoReload;
                Gsettings.autoReloadInterval = autoReloadInterval;
                GM_setValue('Gsettings', Gsettings);

                let task = () => {
                    window.location.reload();
                    if (autoReload) {
                        setTimeout(task, autoReloadInterval * 1000);
                    }
                }

                if (autoReload) {
                    setTimeout(task, autoReloadInterval * 1000);
                }
            });

            let txtSkey = genInput(skey ?? '', '推送密钥', false);
            let btnSaveFTQQ = genBtn('保存密钥', () => {
                Gsettings.skey = skey = txtSkey.value;
                GM_setValue('Gsettings', Gsettings);
            });
            let btnFTQQ = genBtn('测试推送', () => {
                if (txtSkey.value != skey) {
                    alert('请先保存密钥!');
                    return;
                }
                sendQmsg(skey, '【推送测试】\n这是一条测试推送')
                    .then(({ reason, success }) => {
                        if (success) {
                            alert('密钥有效,推送成功');
                        } else {
                            if (confirm(`推送失败,请检查密钥\n\n错误提示: ${reason}\n\n点【确定】跳转到绑定页进行绑定。`)) {
                                window.open('https://qmsg.zendee.cn/me.html');
                            }
                        }
                    });
            });

            let divMenu = document.createElement('div');
            divMenu.className = 'xh_menu';

            divMenu.appendChild(genSpan('==自动填充=='));
            divMenu.appendChild(btnSaveFilter);
            divMenu.appendChild(btnLoadFilter);

            divMenu.appendChild(genSpan('==刷新控制=='));
            divMenu.appendChild(btnManualSearch);
            divMenu.appendChild(genSpan('-搜索间隔(秒)-'));
            divMenu.appendChild(txtAutoSearch);
            divMenu.appendChild(btnAutoSearch);
            divMenu.appendChild(genSpan('-刷新间隔(秒)-'));
            divMenu.appendChild(txtAutoReload);
            divMenu.appendChild(btnAutoReload);

            divMenu.appendChild(genSpan('==Qmsg推送=='));
            divMenu.appendChild(txtSkey);
            divMenu.appendChild(btnSaveFTQQ);
            divMenu.appendChild(btnFTQQ);

            document.body.appendChild(divMenu);
            btnLoadFilter.click();

            if (autoSearch) {
                autoSearch = false;
                btnAutoSearch.click();
            }
            if (autoReload) {
                autoReload = false;
                btnAutoReload.click();
            }
        }, 500);
    } else {
        setTimeout(() => {

            // let verifyCode = document.getElementById('verify_code');
            // if (verifyCode !== null) {
            //     let subs = window.location.pathname.split('/');
            //     let roomid = subs[subs.length - 1];

            //     if (Ghistory.includes(roomid)) {
            //         return;
            //     }
            // }

            let frmFirstname = document.getElementById('firstname');
            let frmSurnamePrefix = document.getElementById('surname_prefix');
            let frmSurname = document.getElementById('surname');
            let frmInitials = document.getElementById('initials');
            let frmGender = document.getElementById('gender');
            let frmEmailTenant = document.getElementById('email_tenant');
            let frmMobileTenant = document.getElementById('phone');
            let frmBirthday = document.getElementById('birthday');
            let frmBirthPlace = document.getElementById('birthplace');
            let frmCountryOfBirth = document.getElementById('country_of_birth');
            let frmCurrentAddress = document.getElementById('current_address');
            let frmCurrentHousenr = document.getElementById('current_housenr');
            let frmCurrentZipcode = document.getElementById('current_zipcode');
            let frmCurrentLocation = document.getElementById('current_location');
            let frmCurrentCountry = document.getElementById('current_country');
            let frmLanguage = document.getElementById('language');
            let frmCountryId = document.getElementById('country_id');
            let frmIdType = document.getElementById('id_type');
            let frmNumberId = document.getElementById('number_id');
            let frmValidId = document.getElementById('valid_id');
            let frmBsn = document.getElementById('bsn');
            let frmIban = document.getElementById('iban');
            let frmBic = document.getElementById('bic');
            let frmRepresentation = document.getElementById('representation');
            let frmSchool_name = document.getElementById('school-name');
            let frmEducation = document.getElementById('education');
            let frmNumber_education = document.getElementById('number_education');
            let frmPackage_0 = document.getElementById('package-0');
            let frmPackage_1 = document.getElementById('package-1');
            let frmPackage_2 = document.getElementById('package-2');
            let frmAgreed = document.getElementById('agreed');

            frmAgreed.checked = true;

            let btnSaveForm = genBtn('储存表单', () => {
                Object.assign(Gsettings, {
                    firstname: frmFirstname.value,
                    surnamePrefix: frmSurnamePrefix.value,
                    surname: frmSurname.value,
                    initials: frmInitials.value,
                    gender: frmGender.value,
                    emailTenant: frmEmailTenant.value,
                    mobileTenant: frmMobileTenant.value,
                    birthday: frmBirthday.value,
                    birthplace: frmBirthPlace.value,
                    countryOfBirth: frmCountryOfBirth.value,
                    currentAddress: frmCurrentAddress.value,
                    currentHousenr: frmCurrentHousenr.value,
                    currentZipcode: frmCurrentZipcode.value,
                    current_location: frmCurrentLocation.value,
                    current_country: frmCurrentCountry.value,
                    language: frmLanguage.value,
                    country_id: frmCountryId.value,
                    id_type: frmIdType.value,
                    number_id: frmNumberId.value,
                    valid_id: frmValidId.value,
                    bsn: frmBsn.value,
                    iban: frmIban.value,
                    bic: frmBic.value,
                    representation: frmRepresentation.value,
                    school_name: frmSchool_name.value,
                    education: frmEducation.value,
                    number_education: frmNumber_education.value,
                    package_0: frmPackage_0.checked,
                    package_1: frmPackage_1.checked,
                    package_2: frmPackage_2.checked,
                });
                GM_setValue('Gsettings', Gsettings);
                alert('表单信息已保存');
            });

            let btnLoadForm = genBtn('自动填表', () => {
                Gsettings = GM_getValue('Gsettings') ?? {};

                const {
                    firstname, surnamePrefix, surname, initials,
                    gender, emailTenant, mobileTenant, birthday,
                    birthplace, countryOfBirth, currentAddress,
                    currentHousenr, currentZipcode, current_location,
                    current_country, language, country_id, id_type,
                    number_id, valid_id, bsn, iban, bic, representation,
                    school_name, education, number_education,
                    package_0, package_1, package_2,
                } = Gsettings;

                frmFirstname.value = firstname ?? '';
                frmSurnamePrefix.value = surnamePrefix ?? '';
                frmSurname.value = surname ?? '';
                frmInitials.value = initials ?? '';
                frmGender.value = gender ?? '';
                frmEmailTenant.value = emailTenant ?? '';
                frmMobileTenant.value = mobileTenant ?? '';
                frmBirthday.value = birthday ?? '';
                frmBirthPlace.value = birthplace ?? '';
                frmCountryOfBirth.value = countryOfBirth ?? '';
                frmCurrentAddress.value = currentAddress ?? '';
                frmCurrentHousenr.value = currentHousenr ?? '';
                frmCurrentZipcode.value = currentZipcode ?? '';
                frmCurrentLocation.value = current_location ?? '';
                frmCurrentCountry.value = current_country ?? '';
                frmLanguage.value = language ?? '';
                frmCountryId.value = country_id ?? '';
                frmIdType.value = id_type ?? '';
                frmNumberId.value = number_id ?? '';
                frmValidId.value = valid_id ?? '';
                frmBsn.value = bsn ?? '';
                frmIban.value = iban ?? '';
                frmBic.value = bic ?? '';
                frmRepresentation.value = representation ?? '';
                frmSchool_name.value = school_name ?? '';
                frmEducation.value = education ?? '';
                frmNumber_education.value = number_education ?? '';
                frmPackage_0.checked = package_0 ?? false;
                frmPackage_1.checked = package_1 ?? false;
                frmPackage_2.checked = package_2 ?? false;
            });

            let divMenu = document.createElement('div');
            divMenu.className = 'xh_menu';

            divMenu.appendChild(genSpan('==自动填充=='));
            divMenu.appendChild(btnSaveForm);
            divMenu.appendChild(btnLoadForm);

            document.body.appendChild(divMenu);
            btnLoadForm.click();

            // autoSubmit();
        }, 500);
    }

    console.log('重新加载');

    function genBtn(name, foo) {
        let btn = document.createElement('button');
        btn.innerText = name;
        btn.addEventListener('click', foo);
        return btn;
    }
    function genInput(value, tips, number = false) {
        let txt = document.createElement('input');
        txt.value = value;
        txt.placeholder = tips;
        if (number) {
            txt.type = 'number';
            txt.min = 3;
            txt.max = 9999;
        }
        return txt;
    }
    function genSpan(text) {
        let span = document.createElement('span');
        span.textContent = text;
        return span;
    }
    function bool2str(bool) {
        return bool ? '✅' : '❌';
    }

    //重新检索
    function reSearch() {
        const { screenX, scrollY } = window;
        const l1 = document.getElementById("search-form");
        const l2 = document.getElementById("page-link1");

        if (l1 == null || l2 == null) { return; }

        // l1.submit();
        l2.click();

        setTimeout(() => {
            window.scrollTo(screenX, scrollY);
        }, 500);
    }
    //检查搜索结果
    function checkItems() {
        let result = [];
        for (let item of document.querySelectorAll('#search-results>div')) {
            let title = item.querySelector('h5');
            let desp = item.querySelector('h6');
            let lis = item.querySelectorAll('li');
            if (lis.length < 3) { continue; }
            let area = lis[0].innerText;
            let price = lis[1].innerText;
            let url = lis[2].querySelector('a').href;
            if (url.search('register') === -1) {
                result.push({ title: title.innerText, desp: desp.innerText, area, price, url });
            } else {
                console.log('未登录');
                break;
            }
        }
        return result;
    }
    // //自动提交
    // function autoSubmit() {
    //     let subs = window.location.pathname.split('/');
    //     let roomid = subs[subs.length - 1];

    //     if (Ghistory.includes(roomid)) {
    //         let submit = document.querySelector('button[type="submit"]');
    //         if (submit !== null) {
    //             submit.click();
    //         }
    //     }
    // }
    //Qmsg推送
    function sendQmsg(skey, msg) {
        if (!skey) { return; }
        return new Promise((resolve, reject) => {
            let opt = {
                url: `https://qmsg.zendee.cn/send/${skey}?msg=${encodeURIComponent(msg)}`,
                method: 'GET',
                timeout: 3000,
                ontimeout: reject,
                onerror: reject,
                onload: ({ response, responseText }) => {
                    try {
                        let data = JSON.parse(response ?? responseText);
                        // console.log(data);
                        resolve(data);
                    } catch (e) {
                        console.error(e);
                        reject(e);
                    }
                }
            };
            GM_xmlhttpRequest(opt);
        });
    }
})();

GM_addStyle(`
div.xh_menu {
    position: fixed;
    z-index: 100;
    right: 0;
    top: 30px;
    width: 130px;
    padding: 8px;
    background: rgba(0, 0, 0, 0.2);
    border-radius: 8px;
    text-align: center;
  }
  div.xh_menu > * {
    float: left;
    width: 100%;
  }
  div.xh_menu > *:not(:last-child) {
    margin-bottom: 10px;
  }
`);
