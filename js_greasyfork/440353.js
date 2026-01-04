// ==UserScript==
// @name         Steam lp
// @namespace    https://keylol.com/t652195-1-1
// @version      0.6
// @description  steam lp
// @author       wave
// @match        http*://store.steampowered.com/*
// @match        http*://help.steampowered.com/*
// @match        http*://steamcommunity.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @grant        GM_addValueChangeListener
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @connect      steampowered.com
// @connect      steamcommunity.com
// @license MIT
// @require      https://cdn.jsdelivr.net/npm/crypto-js@4.0.0/crypto-js.min.js
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAQAAAAAYLlVAAAFP0lEQVR4AdXXA5Ar2R7H8bMuPdtmnH/Gnr22bdu2bdu27bvewfO7tu2Mvw+pqene5EbTefj8ytUn9TtK0ip07p9tad5hTb2PK9xMdke7Y93pLypdaXii78KdZfmyirQL5m6r056ZsCO6OLFhoeLNMdNzfq4ihS+PnRH/yo74iZX0e3PbR2QlHsTUybIgQcRKt818RRnrYmKZSw4kyNho8vGTrynj3P91+fMOJITYaH3IsI3gy60Oa3dee/D+Fd+nwsLEScoYszpafHx82cfNjnRd2XFSx8md1jX6INlt9XomOj+rjCo998/K3f7i8pa/Oqez+ydK496vxk9LfuxEv0JNTxiwDTPGW764u0ee+Lzr55IrnnGgf/bDyqXe/2rnhZI4aPgpX3n9VX3/mv7ptjtU6RxPtCGapDy5Eaf82FZXfyTTn7p/qkqj/wJtAStD5wZasabHtNtgZmlNVRr1PxdKEl9w67cqgI3NzZoRdnovU+F78rUyL7QFGnwYxK35Sdor7ZhGp1X4ztmd2g0IcjYNT2oLVLqvwrenvFW3n3MaqCB0X6s9iElFpfiBnt7UoivwaZIKQsde2lFRXLKqcA3uoP0oJ+cdKgijW2tH2TjjUuHq3k0/l9umoL47m2jvgYnMWOXHm8oP3lAab6hwoN54I+wChW/kq5IUqODwRoHSjXtDhevM94+nnkopzofJwf3LufQd7ajjqU+/rv4P8UbW98c26tqlc7fSp3un6TXOf1mFYom5+l7BhMWQmDGRkFNvUcY3g5x774ZS6EQMjp3E69MsKrAh6Q4kInGSeOvU95R/vJt2WQg1iYxiH9lc5Y8cZBJpiM84qLEB/5dyVD0zElJiWchL9PLZQDLiIy4y/K9BrcWhbUBlLuDbLRohXjEzsKnyp+YxIfhU4h4ef2MaTahNYyaSicdLGvo4B6kDlD/VPxaCTRRnAMhlBC5Ek548BeAmSd7jjCswBYB8WiEIVZnLNpZQF0GowzMA1kSuQBQPAZiC4GQBRRTbQhRCXwDySI5UgXYAPCAKYSp6GxCEvwEwKlIFFgGwFiGBHPSKqIgwG4CtkSqwD4DxCB3xNg6hLQAfRKpANgBDEYbibRZCUwAyIlNgMh6zEWrjrTvCAACORKJAYwrxOIkg/AW920QjbAJgqfEFErhGsUKqI9ThCSXyaI2QyksAWhpdwMl+tDKIQqjCEfKAAj6knuapi4jRBbyP3AGiEYR4KlH8tbMCj55GFogihtq48XaW9ppfg6Zk4LEdCb1AXaIQr9RkI1cp4vXusodd7OIqxU4QFU6BPB6yjQGkIHgSzVpCVcg8XEg4BXLwKCCDedQljgw8LrKV1RzmBf49ZwvVECT8Alp5ANyns+YaLsSXx0xnII2JQxAjCmjl8inzKDkfAwC9zymHaGJgAa37rCMNQdhKiSKmIUgkC2hdJg6hKsWu0hgxrsAqLhPIBAThHgA7iUOMLCC4qMxkTpLD6yxHcHEOuIYgRhcoThz98W0QgosnwOeRLCBE8RK4zSROkqs57y6ERgCsimwBYScAPRAS6MR6jjEWz1X8AIAWRheos9uJaFKbIuApdRFdFgKQEcZLeu1eyp96E+2ILgsAyGEayQiCi3qcBOAV1UMuYGJOWeXPHrPNa9A2PPI4RzY38XhJWyTkpN07/57yhzdqbXN4DRvFU/Qywpi9YKFjVxXIX7+e8nfvCgmM5SAXuU0Wm2iJhBEbdXfxhgrsk+9U/MCCEzEwDqw0WcA7Kji8MaROtd3vP4xyiwGJcZe7WmPFshjfs/8Hvxyu95jGcTAAAAAASUVORK5CYII=
// @downloadURL https://update.greasyfork.org/scripts/440353/Steam%20lp.user.js
// @updateURL https://update.greasyfork.org/scripts/440353/Steam%20lp.meta.js
// ==/UserScript==

(function() {
    function bufferizeSecret(secret) {
        if (typeof secret === 'string') {
            // Check if it's hex
            if (secret.match(/[0-9a-f]{40}/i)) {
                return buffer.Buffer.from(secret, 'hex');
            } else {
                // Looks like it's base64
                return buffer.Buffer.from(secret, 'base64');
            }
        }
        return secret;
    }

    function generateAuthCode(secret, timeOffset) {
        secret = bufferizeSecret(secret);

        let time = Math.floor(Date.now() / 1000) + (timeOffset || 0);

        let b = buffer.Buffer.allocUnsafe(8);
        b.writeUInt32BE(0, 0); // This will stop working in 2038!
        b.writeUInt32BE(Math.floor(time / 30), 4);

        let hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA1, CryptoJS.lib.WordArray.create(secret));
        hmac = buffer.Buffer.from(hmac.update(CryptoJS.lib.WordArray.create(b)).finalize().toString(CryptoJS.enc.Hex), 'hex');

        let start = hmac[19] & 0x0F;
        hmac = hmac.slice(start, start + 4);

        let fullcode = hmac.readUInt32BE(0) & 0x7FFFFFFF;

        const chars = '23456789BCDFGHJKMNPQRTVWXY';

        let code = '';
        for (let i = 0; i < 5; i++) {
            code += chars.charAt(fullcode % chars.length);
            fullcode /= chars.length;
        }

        return code;
    };

    function generateConfirmationKey(identitySecret, time, tag) {
        identitySecret = bufferizeSecret(identitySecret);

        let dataLen = 8;

        if (tag) {
            if (tag.length > 32) {
                dataLen += 32;
            } else {
                dataLen += tag.length;
            }
        }

        let b = buffer.Buffer.allocUnsafe(dataLen);
        b.writeUInt32BE(0, 0);
        b.writeUInt32BE(time, 4);

        if (tag) {
            b.write(tag, 8);
        }

        let hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA1, CryptoJS.lib.WordArray.create(identitySecret));
        return hmac.update(CryptoJS.lib.WordArray.create(b)).finalize().toString(CryptoJS.enc.Base64);
    };

    function getDeviceID(steamID) {
        let salt = '';
        return "android:" + CryptoJS.SHA1(steamID.toString() + salt).toString(CryptoJS.enc.Hex).replace(/^([0-9a-f]{8})([0-9a-f]{4})([0-9a-f]{4})([0-9a-f]{4})([0-9a-f]{12}).*$/, '$1-$2-$3-$4-$5');
    };

    function generateConfirmationQueryParams(account, tag, timeOffset) {
        var time = Math.floor(Date.now() / 1000) + (timeOffset || 0);
        var key = generateConfirmationKey(account.identitySecret, time, tag);
        var deviceID = getDeviceID(account.steamID);
        return 'a=' + account.steamID + '&tag=' + tag + '&m=android&t=' + time + '&p=' + encodeURIComponent(deviceID) + '&k=' + encodeURIComponent(key);
    }

    function showAddAccountDialog(strTitle, strOKButton, strCancelButton, rgModalParams) {
        if (!strOKButton) {
            strOKButton = '确定';
        }
        if (!strCancelButton) {
            strCancelButton = '取消';
        }

        var $Body = $J('<form/>');
        var $AccountNameInput = $J('<input/>', {type: 'text', 'class': ''});
        var $SharedSecretInput = $J('<input/>', {type: 'text', 'class': ''});
        var $SteamIDInput = $J('<input/>', {type: 'text', 'class': ''});
        var $IdentitySecretInput = $J('<input/>', {type: 'text', 'class': ''});
        if (rgModalParams && rgModalParams.inputMaxSize) {
            $AccountNameInput.attr('maxlength', rgModalParams.inputMaxSize);
            $SharedSecretInput.attr('maxlength', rgModalParams.inputMaxSize);
            $SteamIDInput.attr('maxlength', rgModalParams.inputMaxSize);
            $IdentitySecretInput.attr('maxlength', rgModalParams.inputMaxSize);
        }
        $Body.append($J('<div/>', {'class': 'newmodal_prompt_description'}).append('Steam 帐户名称<span data-tooltip-text="非个人资料名称，用于自动填写 Steam 令牌验证码。"> (?)</span>'));
        $Body.append($J('<div/>', {'class': 'newmodal_prompt_input gray_bevel for_text_input fullwidth'}).append($AccountNameInput));
        $Body.append($J('<div/>', {'class': 'newmodal_prompt_description', 'style': 'margin-top: 8px;'}).append('共享密钥<span data-tooltip-text="即 shared secret，用于生成 Steam 令牌验证码。"> (?)</span>'));
        $Body.append($J('<div/>', {'class': 'newmodal_prompt_input gray_bevel for_text_input fullwidth'}).append($SharedSecretInput));
        $Body.append($J('<div/>', {'class': 'newmodal_prompt_description', 'style': 'margin-top: 8px;'}).append('64 位 Steam ID<span data-tooltip-text="以“7656”开头的 17 位数字，用于确认交易与市场。"> (?)</span>'));
        $Body.append($J('<div/>', {'class': 'newmodal_prompt_input gray_bevel for_text_input fullwidth'}).append($SteamIDInput));
        $Body.append($J('<div/>', {'class': 'newmodal_prompt_description', 'style': 'margin-top: 8px;'}).append('身份密钥<span data-tooltip-text="即 identity secret，用于确认交易与市场。"> (?)</span>'));
        $Body.append($J('<div/>', {'class': 'newmodal_prompt_input gray_bevel for_text_input fullwidth'}).append($IdentitySecretInput));

        var deferred = new jQuery.Deferred();
        var fnOK = function() {
            var name = $AccountNameInput.val().trim();
            var secret = $SharedSecretInput.val().trim();
            var steamID = $SteamIDInput.val().trim();
            var identitySecret = $IdentitySecretInput.val().trim();
            if (!name) {
                name = '无名氏';
            }
            if (!secret) {
                ShowAlertDialog('错误', '请输入有效的共享密钥。', '确定');
                return;
            }
            if (steamID && steamID.indexOf('7656') != 0 && steamID.length != 17) {
                ShowAlertDialog('错误', '请输入有效的 64 位 Steam ID。', '确定');
                return;
            }
            deferred.resolve(name, secret, steamID, identitySecret);
        };
        var fnCancel = function() {
            deferred.reject();
        };

        $Body.submit(function(event) {
            event.preventDefault();
            fnOK();
        });

        var $OKButton = _BuildDialogButton(strOKButton, true);
        $OKButton.click(fnOK);
        var $CancelButton = _BuildDialogButton(strCancelButton);
        $CancelButton.click(fnCancel);

        var Modal = _BuildDialog(strTitle, $Body, [$OKButton, $CancelButton], fnCancel);
        if(!rgModalParams || !rgModalParams.bNoPromiseDismiss) {
            deferred.always(function() {
                Modal.Dismiss();
            });
        }

        Modal.Show();

        $AccountNameInput.focus();

        // attach the deferred's events to the modal
        deferred.promise(Modal);

        return Modal;
    }

    function showImportAccountDialog(strTitle, strDescription, strOKButton, strCancelButton, textAreaMaxLength) {
        if (!strOKButton) {
            strOKButton = '确定';
        }
        if (!strCancelButton) {
            strCancelButton = '取消';
        }

        var $Body = $J('<form/>');
        var $TextArea = $J('<textarea/>', {'class': 'newmodal_prompt_textarea'});
        $TextArea.attr('placeholder', strDescription);
        if (textAreaMaxLength) {
            $TextArea.attr('maxlength', textAreaMaxLength);
            $TextArea.bind('keyup change', function() {
                var str = $J(this).val();
                var mx = parseInt($J(this).attr('maxlength'));
                if (str.length > mx) {
                    $J(this).val(str.substr(0, mx));
                    return false;
                }
            });
        }
        $Body.append($J('<div/>', {'class': 'newmodal_prompt_with_textarea gray_bevel fullwidth'}).append($TextArea));

        var deferred = new jQuery.Deferred();
        var fnOK = function() {
            deferred.resolve($TextArea.val());
        };
        var fnCancel = function() {
            deferred.reject();
        };

        $Body.submit(function(event) {
            event.preventDefault();
            fnOK();
        });

        var $OKButton = _BuildDialogButton(strOKButton, true);
        $OKButton.click(fnOK);
        var $CancelButton = _BuildDialogButton(strCancelButton);
        $CancelButton.click(fnCancel);

        var Modal = _BuildDialog(strTitle, $Body, [$OKButton, $CancelButton], fnCancel);
        deferred.always(function() {
            Modal.Dismiss();
        });
        Modal.Show();

        $TextArea.focus();

        // attach the deferred's events to the modal
        deferred.promise(Modal);

        return Modal;
    }

    function addAccount() {
        showAddAccountDialog('添加账户', '确定', '取消').done(function(name, secret, steamID, identitySecret) {
            if (steamID && identitySecret) {
                accounts.push({
                    name,
                    secret,
                    steamID,
                    identitySecret
                });
                GM_setValue('accounts', accounts);
                ShowAlertDialog('添加账户', '添加成功，该账户支持确认交易与市场。', '确定');
            } else {
                accounts.push({
                    name,
                    secret
                });
                GM_setValue('accounts', accounts);
                ShowAlertDialog('添加账户', '添加成功，该账户不支持确认交易与市场。', '确定');
            }
        });
        setupTooltips($J('.newmodal'));
    }

    function importAccount() {
        showImportAccountDialog('导入账户', '将要导入的数据粘贴于此', '确定', '取消').done(function(data) {
            try {
                data = JSON.parse(data.replace(/("SteamID":)(\d+)/, '$1"$2"'));
                var name = data.account_name || '无名氏';
                var secret = data.shared_secret;
                var steamID = data.steamid || data.Session && data.Session.SteamID || '';
                var identitySecret = data.identity_secret;
                if (!secret) {
                    ShowAlertDialog('错误', '共享密钥不存在，请检查后再试。', '确定').done(function() {
                        importAccount();
                    });
                    return;
                }
                if (steamID && identitySecret) {
                    accounts.push({
                        name,
                        secret,
                        steamID,
                        identitySecret
                    });
                    GM_setValue('accounts', accounts);
                    ShowAlertDialog('导入账户', '导入成功，该账户支持确认交易与市场。', '确定');
                } else {
                    accounts.push({
                        name,
                        secret
                    });
                    GM_setValue('accounts', accounts);
                    ShowAlertDialog('导入账户', '导入成功，该账户不支持确认交易与市场。', '确定');
                }
            } catch(err) {
                ShowAlertDialog('错误', '数据格式有误，请检查后再试。', '确定').done(function() {
                    importAccount();
                });
            }
        });
    }

    function deleteAccount(elem) {
        ShowConfirmDialog('删除账户', '确定删除该账户吗？', '确定', '取消').done(function() {
            var $Elem = $JFromIDOrElement(elem);
            if ($Elem.data('id') >= accounts.length) {
                ShowAlertDialog('错误', '无法删除该账户，请稍后再试。', '确定').done(function() {
                    window.location.reload();
                });
            } else {
                var account = accounts.splice($Elem.data('id'), 1)[0];
                GM_setValue('accounts', accounts);
                ShowAlertDialog('删除账户', '删除成功。', '确定');
            }
        });
    }

    function copyAuthCode(elem) {
        var $Elem = $JFromIDOrElement(elem);
        GM_setClipboard(generateAuthCode(accounts[$Elem.data('id')].secret, timeOffset));
        $Elem.css('width', window.getComputedStyle(elem, null).width).text('复制成功').addClass('copy_success');
        setTimeout(function() {
            $Elem.text($Elem.data('name')).removeClass('copy_success');
        }, 1000);
    }

    function refreshAccounts() {
        $AuthenticatorPopupMenu.empty();
        $J.each(accounts, function(i, v) {
            var $AuthenticatorPopupMenuItem = $J('<span/>', {'style': 'display: block; padding: 5px 0 5px 12px; margin-right: 27px; min-width: 50px;', 'data-id': i, 'data-name': v.name, 'data-tooltip-text': '点击复制该账户的验证码'}).append(v.name);
            var $AuthenticatorDeleteAccount = $J('<span/>', {'class': 'delete_account', 'data-id': i, 'data-tooltip-text': '删除该账户'});
            $AuthenticatorPopupMenu.append($J('<a/>', {'class': 'popup_menu_item', 'style': 'position: relative; padding: 0;'}).append($AuthenticatorPopupMenuItem, $AuthenticatorDeleteAccount));
            $AuthenticatorPopupMenuItem.on('click', function() {
                copyAuthCode(this);
            });
            $AuthenticatorDeleteAccount.on('click', function() {
                deleteAccount(this);
            });
        });
        setupTooltips($AuthenticatorPopupMenu);

        var $AuthenticatorAddAccount = $J('<a/>', {'class': 'popup_menu_item'}).append('添加账户');
        $AuthenticatorPopupMenu.append($AuthenticatorAddAccount);
        $AuthenticatorAddAccount.on('click', function() {
            addAccount();
        });

        var $AuthenticatorImportAccount = $J('<a/>', {'class': 'popup_menu_item'}).append('导入账户');
        $AuthenticatorPopupMenu.append($AuthenticatorImportAccount);
        $AuthenticatorImportAccount.on('click', function() {
            importAccount();
        });
    }

    function createConfirmationLink(steamID) {
        if (!$AuthenticatorPopupMenu.find('.confirmation').length) {
            $J.each(accounts, function(i, v) {
                if (v.steamID && steamID == v.steamID) {
                    var $AuthenticatorConfirmation = $J('<a/>', {'class': 'popup_menu_item confirmation'}).append('确认交易与市场');
                    $AuthenticatorPopupMenu.append($AuthenticatorConfirmation);
                    $AuthenticatorConfirmation.on('click', function() {
                        window.open('https://steamcommunity.com/mobileconf/conf?' + generateConfirmationQueryParams(v, 'conf', timeOffset), '确认交易与市场', 'height=790,width=600,resize=yes,scrollbars=yes');
                    });
                    return false;
                }
            });
        }
    }

    function setupTooltips(selector) {
        if (window.location.hostname == 'store.steampowered.com') {
            BindTooltips(selector, {tooltipCSSClass: 'store_tooltip'});
        } else if (window.location.hostname == 'help.steampowered.com') {
            BindTooltips(selector, {tooltipCSSClass: 'help_tooltip'});
        } else if (window.location.hostname == 'steamcommunity.com') {
            BindTooltips(selector, {tooltipCSSClass: 'community_tooltip'});
        }
    }

    GM_addStyle(`
        .delete_account {
            position: absolute;
            right: 0;
            top: 0;
            padding: 0 7.5px;
            width: 12px;
            height: 100%;
            background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAQAAAD8fJRsAAAAkElEQVR4AXWQxWEDMRBFJ6AWArqGmW7G12HMDN0ZFmr4dqKF00rDPGPhycnr/vi9nJVPl2qI7Dd0WZpZEyFEygKhy1CkPsX4JCLlB6OP6jo3eRHxhh3xA+OBLULedCtExDOGcRvM6DZzpP/RxgtR4fDKat/ylPUKpZwao1A769VBDbls3H5WO6KfjVu5YOVJDkyDcoTnvnKRAAAAAElFTkSuQmCC);
            background-position: center;
            background-repeat: no-repeat;
            background-origin: content-box;
            cursor: pointer;
        }
        .copy_success {
            color: #57cbde !important;
        }
    `);

    var $GlobalActionMenu = $J('#global_action_menu');
    var $AuthenticatorLink = $J('<span/>', {'class': 'pulldown global_action_link', 'style': 'display: inline-block; padding-left: 4px; line-height: 25px;', 'onclick': 'ShowMenu(this, "authenticator_dropdown", "right");'}).append('Steam 令牌验证器');
    var $AuthenticatorDropdown = $J('<div/>', {'class': 'popup_block_new', 'id': 'authenticator_dropdown', 'style': 'display: none;'});
    var $AuthenticatorPopupMenu = $J('<div/>', {'class': 'popup_body popup_menu'});

    $GlobalActionMenu.prepend($AuthenticatorDropdown.append($AuthenticatorPopupMenu));
    $GlobalActionMenu.prepend($AuthenticatorLink);

    var accounts = GM_getValue('accounts') || [];

    refreshAccounts();

    GM_addValueChangeListener('accounts', function(name, old_value, new_value, remote) {
        accounts = new_value;
        refreshAccounts();

        if (userSteamID) {
            $AuthenticatorPopupMenu.find('.confirmation').remove();
            createConfirmationLink(userSteamID);
        }

        AlignMenu($AuthenticatorLink, 'authenticator_dropdown', 'right');
    });

    if (window.location.pathname == '/mobileconf/conf') {
        let account;
        $J.each(accounts, function(i, v) {
            if (v.steamID && g_steamID == v.steamID) {
                account = v;
                return false;
            }
        });

        unsafeWindow.GetValueFromLocalURL = function(url, timeout, success, error, fatal) {
            if (url.indexOf('steammobile://steamguard?op=conftag&arg1=allow') !== -1) {
                success(generateConfirmationQueryParams(account, 'allow', timeOffset));
            } else if (url.indexOf('steammobile://steamguard?op=conftag&arg1=cancel') !== -1) {
                success(generateConfirmationQueryParams(account, 'cancel', timeOffset));
            } else if (url.indexOf('steammobile://steamguard?op=conftag&arg1=details') !== -1) {
                success(generateConfirmationQueryParams(account, 'details', timeOffset));
            }
        };

        $J('.mobileconf_list_entry').each(function() {
            var $this = $J(this);
            if (!$this.has('.mobileconf_list_checkbox').length) {
                var $ConfirmationEntryCheckbox = $J('<div/>', {'class': 'mobileconf_list_checkbox'}).append($J('<input/>', {'id': 'multiconf_' + $this.data('confid'), 'data-confid': $this.data('confid'), 'data-key': $this.data('key'), 'value': '1', 'type': 'checkbox'}));
                $this.find('.mobileconf_list_entry_icon').after($ConfirmationEntryCheckbox);
                $ConfirmationEntryCheckbox.on('click', function(e) {
                    e.stopPropagation();

                    var nChecked = $J('.mobileconf_list_checkbox input:checked').length;
                    var $elButtons = $J('#mobileconf_buttons');

                    if (nChecked > 0) {
                        var $btnCancel = $J('#mobileconf_buttons .mobileconf_button_cancel');
                        var $btnAccept = $J('#mobileconf_buttons .mobileconf_button_accept');
                        $btnCancel.unbind();
                        $btnAccept.unbind();

                        $btnCancel.text('取消选择');
                        $btnAccept.text('确认已选择');

                        $btnCancel.click(function () {
                            ActionForAllSelected('cancel');
                        });

                        $btnAccept.click(function () {
                            ActionForAllSelected('allow');
                        });

                        if ($elButtons.is(':hidden')) {
                            $elButtons.css('bottom', -$elButtons.height() + 'px');
                            $elButtons.show();
                        }
                        $elButtons.css('bottom', '0');
                    } else {
                        $elButtons.css('bottom', -$elButtons.height() + 'px');
                    }
                });
            }
        });

        var $ResponsiveHeaderContent = $J('.responsive_header_content');
        var $ConfirmationCheckAll = $J('<div/>', {'class': 'btn_green_steamui btn_medium'}).append('<span>全选</span>');
        var $ConfirmationRefresh = $J('<div/>', {'class': 'btn_blue_steamui btn_medium'}).append('<span>刷新</span>');
        $ResponsiveHeaderContent.append($J('<div/>', {'style': 'position: absolute; top: 15px; right: 8px;'}).append($ConfirmationCheckAll, '\n', $ConfirmationRefresh));
        $ConfirmationCheckAll.on('click', function() {
            if ($J('#mobileconf_list').is(':visible') && $J('#mobileconf_details').is(':hidden')) {
                $J('.mobileconf_list_checkbox input:not(:checked)').click();
            }
        });
        $ConfirmationRefresh.on('click', function() {
            if (account) {
                window.location.replace('https://steamcommunity.com/mobileconf/conf?' + generateConfirmationQueryParams(account, 'conf', timeOffset));
            } else {
                window.location.reload();
            }
        });
    }

    var intersectionObserver = new IntersectionObserver(function(entries) {
        if (entries[0].intersectionRatio > 0) {
            var name = $J('#login_twofactorauth_message_entercode_accountname, [class^="login_SigningInAccountName"]').text();
            $J.each(accounts, function(i, v) {
                if(name == v.name) {
                    $J('#twofactorcode_entry, [class^="login_AuthenticatorInputcontainer"] input.DialogInput').val(generateAuthCode(v.secret, timeOffset));
                    if ($J('[class^="login_AuthenticatorInputcontainer"] input.DialogInput').length) {
                        $J('[class^="login_AuthenticatorInputcontainer"] input.DialogInput')[0]._valueTracker.setValue('');
                        $J('[class^="login_AuthenticatorInputcontainer"] input.DialogInput')[0].dispatchEvent(new Event('input', {bubbles: true}));
                    }
                    return false;
                }
            });
        }
    });

    var mutationObserver = new MutationObserver(function() {
        if ($J('#twofactorcode_entry, [class^="login_AuthenticatorInputcontainer"] input.DialogInput').length) {
            intersectionObserver.observe($J('#twofactorcode_entry, [class^="login_AuthenticatorInputcontainer"] input.DialogInput')[0]);
        }
    });

    var userSteamID;

    if ($J('#account_dropdown .persona').length) {
        if (typeof g_steamID != 'undefined' && g_steamID) {
            userSteamID = g_steamID;
            createConfirmationLink(userSteamID);
        } else {
            GM_xmlhttpRequest({
                method: 'GET',
                url: 'https://steamcommunity.com/my/?xml=1',
                onload: function(response) {
                    if (response.responseXML) {
                        var steamID = $J(response.responseXML).find('steamID64').text();
                        if (steamID) {
                            userSteamID = steamID;
                            createConfirmationLink(userSteamID);
                        }
                    }
                }
            });
        }
        if (window.location.href.indexOf('store.steampowered.com/login/?purchasetype=') !== -1) {
            mutationObserver.observe(document.body, {childList: true, subtree: true});
        }
    } else {
        mutationObserver.observe(document.body, {childList: true, subtree: true});
    }

    var timeOffset = 0;

    GM_xmlhttpRequest({
        method: 'POST',
        url: 'https://api.steampowered.com/ITwoFactorService/QueryTime/v0001',
        responseType: 'json',
        onload: function(response) {
            if (response.response && response.response.response && response.response.response.server_time) {
                timeOffset = response.response.response.server_time - Math.floor(Date.now() / 1000);
            }
        }
    });
})();
