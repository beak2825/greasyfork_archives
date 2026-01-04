const css_content = `
    :root {
    	--dark: #34495e;
    	--light: #fff;
    	--success: #0abf30;
    	--error: #e24d4c;
    	--warning: #e9bd0c;
    	--info: #3498db
    }
    
    #plugin-settings-main {
    	display: flex;
    	flex-direction: column;
    	justify-content: center
    }
    
    #plugin-settings-main>div {
    	border: 1px solid #e7e9eb;
    	border-radius: 4px;
    	width: 100%;
    	display: flex;
    	flex-direction: column;
    	padding: 1em 2em;
    	margin-bottom: 0.5em
    }
    
    #plugin-settings-main>div>div {
    	width: 100%;
    	display: flex;
    	align-items: center
    }
    
    #plugin-settings-main .hr {
    	width: 100%;
    	background-color: #69c0ff;
    	height: 2px
    }
    
    #plugin-settings-main .hr- {
    	width: 100%;
    	background-color: #e7e9eb;
    	height: 1px
    }
    
    #plugin-settings-main h2 {
    	font-size: 18px
    }
    
    #plugin-settings-main p {
    	margin: 0;
    	font-size: 16px
    }
    
    #plugin-settings-main input {
    	margin: 0.5em 0.5em;
    	padding: 0.5em 0.5em;
    	border-radius: 4px;
    	border: 1px solid black;
    	background-color: none
    }
    
    #plugin-settings-main input:-webkit-autofill,
    textarea:-webkit-autofill,
    select:-webkit-autofill {
    	-webkit-box-shadow: 0 0 0px 1000px transparent inset !important;
    	background-color: transparent;
    	background-image: none;
    	transition: background-color 50000s ease-in-out 0s
    }
    
    #plugin-settings-main button {
    	padding: 0.3em 1em;
    	border: 2px solid #2881ff;
    	background-color: #3a97fe;
    	color: white;
    	border-radius: 5px;
    	width: max-content
    }
    
    #plugin-settings-main button:disabled {
    	border: 2px solid #c5c7c8;
    	background-color: #e7e9eb;
    	color: black
    }
    
    #plugin-settings-main .button {
    	justify-content: end
    }
    
    #plugin-settings-main .switch {
    	display: flex
    }
    
    #plugin-settings-main .switch>p {
    	flex-grow: 1
    }
    
    #plugin-settings-main .note {
    	font-size: 14px;
    	color: #8f8f8f;
    	margin: 0
    }
    
    #plugin-settings-main .warning {
    	font-size: 14px;
    	color: red
    }
    
    #plugin-settings-main .flex-c {
    	display: flex;
    	flex-direction: column
    }
    
    #plugin-settings-main .flex {
    	display: flex
    }
    
    #plugin-settings-main .flex-1 {
    	flex-grow: 1
    }
    
    #plugin-settings-main div.switch {
    	padding: 0.5em 0
    }
    
    #plugin-settings-main .switch {
    	--button-width: 2.625em;
    	--button-height: 1.5em;
    	--toggle-diameter: 1.2em;
    	--button-toggle-offset: calc((var(--button-height) - var(--toggle-diameter)) / 2);
    	--toggle-shadow-offset: 10px;
    	--toggle-wider: 2.4em;
    	--color-grey: #cccccc;
    	--color-green: #3a97fe
    }
    
    #plugin-settings-main .slider {
    	display: inline-block;
    	width: var(--button-width);
    	height: var(--button-height);
    	background-color: var(--color-grey);
    	border-radius: calc(var(--button-height) / 2);
    	position: relative;
    	transition: 0.3s all ease-in-out
    }
    
    #plugin-settings-main .slider::after {
    	content: "";
    	display: inline-block;
    	width: var(--toggle-diameter);
    	height: var(--toggle-diameter);
    	background-color: #fff;
    	border-radius: calc(var(--toggle-diameter) / 2);
    	position: absolute;
    	top: var(--button-toggle-offset);
    	transform: translateX(var(--button-toggle-offset));
    	box-shadow: var(--toggle-shadow-offset) 0 calc(var(--toggle-shadow-offset) * 4) rgba(0, 0, 0, 0.1);
    	transition: 0.3s all ease-in-out
    }
    
    #plugin-settings-main .switch input[type="checkbox"]:checked+.slider {
    	background-color: var(--color-green)
    }
    
    #plugin-settings-main .switch input[type="checkbox"]:checked+.slider::after {
    	transform: translateX(calc(var(--button-width) - var(--toggle-diameter) - var(--button-toggle-offset)));
    	box-shadow: calc(var(--toggle-shadow-offset) * -1) 0 calc(var(--toggle-shadow-offset) * 4) rgba(0, 0, 0, 0.1)
    }
    
    #plugin-settings-main .switch input[type="checkbox"] {
    	display: none
    }
    
    #plugin-settings-main .switch input[type="checkbox"]:active+.slider::after {
    	width: var(--toggle-wider)
    }
    
    #plugin-settings-main .switch input[type="checkbox"]:checked:active+.slider::after {
    	transform: translateX(calc(var(--button-width) - var(--toggle-wider) - var(--button-toggle-offset)))
    }
    
    .notifications:where(.toast, .column) {
    	display: flex;
    	align-items: center
    }
    
    .notifications .column {
    	display: flex;
    	align-items: center
    }
    
    .notifications {
    	position: fixed;
    	top: 30px;
    	right: 20px;
    	z-index: 9999
    }
    
    .notifications .toast {
    	width: 350px;
    	list-style: none;
    	display: flex;
    	align-items: center;
    	position: relative;
    	overflow: hidden;
    	border-radius: 8px;
    	border: 1px solid rgb(220, 218, 215);
    	padding: 16px 17px;
    	margin-bottom: 10px;
    	background-color: var(--light);
    	justify-content: space-between;
    	animation: show_toast 0.3s forwards
    }
    
    @keyframes show_toast {
    	0% {
    		transform: translateX(100%)
    	}
    
    	40% {
    		transform: translateX(-5%)
    	}
    
    	80% {
    		transform: translateX(0)
    	}
    
    	100% {
    		transform: translateX(-10px)
    	}
    }
    
    .toast .column i {
    	font-size: 1.75rem
    }
    
    .toast.hide {
    	animation: hide_toast 0.3s forwards
    }
    
    @keyframes hide_toast {
    	0% {
    		transform: translateX(-10%)
    	}
    
    	40% {
    		transform: translateX(0%)
    	}
    
    	80% {
    		transform: translateX(-5%)
    	}
    
    	100% {
    		transform: translateX(calc(100% + 20px))
    	}
    }
    
    .toast .column span {
    	font-size: 1.07rem;
    	margin-left: 12px
    }
    
    .toast i:last-child {
    	color: #aeb0d7;
    	cursor: pointer
    }
    
    .toast i:last-child:hover {
    	color: var(--dark)
    }
    
    .toast::after {
    	content: attr(time time)''
    }
    
    .toast::before {
    	content: '';
    	position: absolute;
    	left: 0;
    	bottom: 0;
    	width: 100%;
    	height: 3px;
    	animation: progress 5s linear forwards
    }
    
    @keyframes progress {
    	100% {
    		width: 0
    	}
    }
    
    .toast.success::before,
    .btn#success {
    	background-color: var(--success)
    }
    
    .toast.error::before,
    .btn#error {
    	background-color: var(--error)
    }
    
    .toast.warning::before,
    .btn#warning {
    	background-color: var(--warning)
    }
    
    .toast.info::before,
    .btn#info {
    	background-color: var(--info)
    }
    
    .toast.success .column i {
    	color: var(--success)
    }
    
    .toast.error .column i {
    	color: var(--error)
    }
    
    .toast.warning .column i {
    	color: var(--warning)
    }
    
    .toast.info .column i {
    	color: var(--info)
    }
    
    @media screen and (max-width:530px) {
    	.notifications {
    		width: 95%
    	}
    
    	.notifications .toast {
    		width: 100%;
    		font-size: 1rem;
    		margin-left: 20px
    	}
    
    	.buttons .btn {
    		margin: 0 1px;
    		font-size: 1.1rem;
    		padding: 8px 15px
    	}
    }
`;
const jwgl_error = `
    <h2 style="color:white;margin: 0;display: block;font-size: 1.5em;font-weight: bold;">似乎来到了错误的网站.^.</h2>
    <p style="color:white;margin: 0.5em 0;text-align: center;">愿意现在跳转至教务系统登录网站吗？<br>（jwgl.nxu.edu.cn）</p>
    <div id="control-button" style="display: flex;">
        <button onclick="this.parentNode.parentNode.remove()" style="height: auto;margin: 0.5em 1em;padding: 0.5em 1em;border: 1px white solid;border-radius: 4px;font-weight: bold;color: white;background:#2193b0;background: -webkit-linear-gradient(to right bottom, #6dd5ed, #2193b0);background: linear-gradient(to right bottom, #6dd5ed, #2193b0);">不用了<br>我再看看</button>
        <button onclick="window.close()" style="height: auto;margin: 0.5em 1em;padding: 0.5em 1em;border: 1px white solid;border-radius: 4px;font-weight: bold;color: white;background:#2193b0;background: -webkit-linear-gradient(to right bottom, #6dd5ed, #2193b0);background: linear-gradient(to right bottom, #6dd5ed, #2193b0);">不用了<br>关闭当前窗口</button>
    </div>
`;
const settings_div = `
    <div data-id="plugin-settings" class="block-group">
        <h1 class="block-group__title">插件设置</h1>
        <div id="plugin-settings-main">
            <div class="block-group__item">
                <h2>账号设置</h2>
                <div class="hr"></div>
                <div>
                    <p>学号：</p>
                    <input type="text" id="username" />
                </div>
                <p class="warning" id="username-empty" style="display: none;">学号不能为空！</p>
                <p class="warning" id="username-error" style="display: none;">学号格式错误！</p>
                <div>
                    <p>密码：</p>
                    <input type="password" id="password" />
                </div>
                <p class="warning" id="password-empty" style="display: none;">密码不能为空！</p>
                <div class="button">
                    <button id="reflash-user-info">提交</button>
                </div>
                <p class="note">注：用于系统自动登录，可留空。<span style="color:orange">请确保学号密码输入正确！</span></p>
            </div>
            <div class="block-group__item">
                <h2>功能设置</h2>
                <div class="hr"></div>
                <div class="switch">
                    <p>自动登录</p>
                    <label class="switch">
                        <input type="checkbox" id="auto-login">
                        <span class="slider"></span>
                    </label>
                </div>
                <div class="hr-"></div>
                <div class="switch">
                    <div class="flex-c flex-1">
                        <p>自动关闭错误网站</p>
                        <p class="note">(包括404、服务器错误等)</p>
                    </div>
                    <label class="switch">
                        <input type="checkbox" id="auto-close">
                        <span class="slider"></span>
                    </label>
                </div>
            </div>
            <div class="block-group__item">
                <h2>功能预览</h2>
                <div class="hr"></div>
                <div class="block-group__content" style="margin-top: 1em;">
                    <div class="block-group__item__wrap" style="width: 33%;">
                        <a href="javascript:void(0)" class="block-group__item">
                            <div class="block-group__item__logo__wrap">
                               <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAgtJREFUWEftVz1PG0EQfbO2QVaaNCmgcpUCIus+Fmr7R1AgISUIQRwpTX5BQEqVBqEUkWmgoqOlxY0b69Z2A5Go6CKlQqK+nWgdnxXguF3HJ2JLrHSN9+3Mm7fPox2Cw/I8r1IoFM4BtJRSm1lHpJRftda1YrG40el0rmzhyQYw+1LKGjMnBOpZZ8IwNLgaEdWjKGrZ4k8HAd/3Xwkh1gCYL229BOABuAHQt1RlcAZvcAaftg7iOG71+/2bgQJSyo/M/M0mV577zLzX7XZ3BwSSe2PmTSHEdUoij5n3TVVE9CmLyBDnDXFpai0w8wmAC6XUm4QAm6BKqVRP5G3CMAxH+WaDQLVafVEqlRpE9COKojNLH1jXWs+Xy+XTdrt9m4YdW4E8zTf03MMrYB78tpd3srR4RPQ58dzAA0EQMJFTT8qVnzH9yIT/VYG/TZFriY8Em04TZjWivFWZHQW871wpApV/VSAm/Oo16PL+eWcFwuaf5jDJIo169IHuPEycCQRN3oHG4gQErstzOG1v0Z2W7ExggsSZR2eHQHjIR7CZUOMShC/qPf10VcxZgaDJHQJWbIFZQHa3Sdlwyb4zgdVDfq3jbBM+9lfLIuNMwLWicXHPBKZXAa31cq/Xe9C7x73jLLzv+0tCiIv7T7Ld5J2WZzJLrGMzaSejmZl+3wJ49xQEzFgmhGiZ6fk37NF2MC4ilNUAAAAASUVORK5CYII=">
                            </div>
                            <div class="block-group__item__content">
                                <h2 title="智慧党建" class="block-group__item__name">智慧党建</h2>
                                <div title="zhdj.nxu.edu.cn" class="block-group__item__desc">zhdj.nxu.edu.cn</div>
                                <svg aria-hidden="true" title="收藏" class="wrdvpn-icon">
                                    <use xlink:href="#wrdvpn-collect"></use>
                                </svg>
                            </div>
                        </a>
                    </div>
                     <div class="block-group__item__wrap" style="width: 33%;">
                        <a href="javascript:void(0)" class="block-group__item">
                            <div class="block-group__item__logo__wrap">
                                <div class="block-group__item__logo" style="background-color: rgb(71, 179, 71);">智</div>
                            </div>
                            <div class="block-group__item__content">
                                <h2 title="智慧党建" class="block-group__item__name">智慧党建</h2>
                                <div title="zhdj.nxu.edu.cn" class="block-group__item__desc">zhdj.nxu.edu.cn</div>
                                <svg aria-hidden="true" title="收藏" class="wrdvpn-icon">
                                    <use xlink:href="#wrdvpn-collect"></use>
                                </svg>
                            </div>
                        </a>
                    </div>
                     <div class="block-group__item__wrap" style="width: 33%;">
                        <a href="javascript:void(0)" class="block-group__item">
                            <div class="block-group__item__logo__wrap">
                                <div class="block-group__item__logo" style="background-color: rgb(71, 179, 71);">智</div>
                            </div>
                            <div class="block-group__item__content">
                                <h2 title="智慧党建" class="block-group__item__name">智慧党建</h2>
                                <div title="zhdj.nxu.edu.cn" class="block-group__item__desc">zhdj.nxu.edu.cn</div>
                                <svg aria-hidden="true" title="收藏" class="wrdvpn-icon">
                                    <use xlink:href="#wrdvpn-collect"></use>
                                </svg>
                            </div>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
`;
const jwgl_table_title = (message, id1, id2 = "") => {
    return `
        <table id="${id1}" border="0" cellspacing="0" cellpadding="0" style="display: block;">
            <tr>
                <td>
                    <a href="javascript:0;" style="display:block;width:24px;height:22px">
                        <img src="static/images/tree/minus.gif" width="24" height="22" border="0">
                    </a>
                    <a class="MenuTocItemFolderLinkStyle" href="javascript:0;" target="">
                        <img src="static/images/tree/entityfolder.gif" width="0" height="0" border="0">
                    </a>
                </td>
                <td valign="middle" nowrap="">
                    <a ${(id2!="") ? (`id="${id2}"`) : ("")} class="MenuTocItemFolderLinkStyle" href="javascript:0;" target="">${message}</a>
                </td>
            </tr>
        </table>
    `
};
const jwgl_table_content = (message, id) => {
    return `
        <table border="0" cellspacing="0" cellpadding="0" style="display: block;">
            <tbody>
                <tr>
                    <td valign="top" nowrap="">
                        <img src="static/images/tree/line.gif" width="24" height="22">
                    </td>
                    <td valign="middle" nowrap="">
                        <img src="static/images/tree/sanjiao.gif" border="0">
                        <a id="${id}" class="MenuTocItemLinkStyle" target="main">${message}</a>
                    </td>
                </tr>
            </tbody>
        </table>
    `;
};
const jwgl_class = (content_array, mode = -1) => {
if (mode == 0) {
    return `
        <div class="class_main" style="display:flex;flex-direction:column;align-items:center;margin-bottom:1em">
            <style>
                .class_main > div {
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    margin: 0;
                }
                .teacher {
                    font-size: 10px;
                    padding: 0;
                }
                .classroom {
                    font-size: 10px;
                    padding: 0;
                    /* color: #eff0ea; */
                }
                .subject {
                    font-size: 16px;
                    font-weight: bold;
                    padding: 0.5em 0;
                }
            </style>
            <div class="classroom">${content_array[3]}</div>
            <div class="subject">${content_array[1]}</div>
            <div class="teacher">${content_array[2]}<br>${content_array[0]}</div>
        </div>
`;} else if (mode > 0) {
    return `
        <div class="class_main" style="display:flex;flex-direction:column;align-items:center;margin-bottom:1em">
            <style>
                .class_main > div {
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    margin: 0;
                }
                .teacher {
                    font-size: 10px;
                    padding: 0;
                }
                .classroom {
                    font-size: 10px;
                    padding: 0;
                    /* color: #eff0ea; */
                }
                .subject {
                    font-size: 16px;
                    font-weight: bold;
                    padding: 0.5em 0;
                }
            </style>
            <div class="teacher">${content_array[2]}<br>${content_array[0]}</div>
        </div>
`;} else {
    return `
        <div class="class_main" style="display:flex;flex-direction:column;align-items:center;margin-bottom:1em">
            <style>
                .class_main > div {
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    margin: 0;
                }
                .teacher {
                    font-size: 10px;
                    padding: 0;
                }
                .classroom {
                    font-size: 10px;
                    padding: 0;
                    /* color: #eff0ea; */
                }
                .subject {
                    font-size: 16px;
                    font-weight: bold;
                    padding: 0.5em 0;
                }
            </style>
            <div class="classroom">${content_array[3]}</div>
            <div class="subject">${content_array[0]}</div>
            <div class="teacher">${content_array[2]}<br>${content_array[1]}</div>
        </div>
    `;}
};