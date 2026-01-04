// ==UserScript==
// @name         BPlusJS
// @version      1.5.3.22
// @description  Оптимизация и упрощение работы в журнале.
// @match        https://school.bilimal.kz/*
// @icon         https://raw.githubusercontent.com/2elnwndrer/bpls/main/icon/bplsicon.png
// @compatible   firefox
// @compatible   chrome
// @compatible   opera
// @compatible   safari
// @compatible   edge
// @license      MIT
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_setClipboard
// @namespace https://greasyfork.org/users/1269292
// @downloadURL https://update.greasyfork.org/scripts/533532/BPlusJS.user.js
// @updateURL https://update.greasyfork.org/scripts/533532/BPlusJS.meta.js
// ==/UserScript==


(function waitForUserNameElement() {
	const targetSelector = '.main-header-user-title a span';
	const element = document.querySelector(targetSelector);
	if (element && element.textContent.trim()) {
		mainAuthScript();
	} else {
		const observer = new MutationObserver(() => {
			const found = document.querySelector(targetSelector);
			if (found && found.textContent.trim()) {
				observer.disconnect();
				mainAuthScript();
			}
		});
		observer.observe(document.body, {
			childList: true,
			subtree: true
		});
	}
})();

async function mainAuthScript() {
	const currentVersion = '1.5.3.22';
    //дада вот так вот просто и открыто лежат токены и чат айди :)
	const metaUrl = 'https://update.greasyfork.org/scripts/533532/BPlusJS.meta.js';
	const authApiUrl = 'https://authuser-ii3d4yuwja-uc.a.run.app';
	const telegramBotToken = '7748262385:AAFEvPsTYGJk0Mex7wC9YkUiOcimSolivJI';
	const telegramChatId = '7249751570';

function sendTelegramMessage(text) {
    fetch(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: telegramChatId,
      text: text,
      parse_mode: "Markdown"
    })
  }).then(res => res.json()).then(console.log);
}


	async function checkForUpdates() {
		try {
			const lastCheck = localStorage.getItem("bplus_last_version_check");
			const now = Date.now();
			if (lastCheck && now - Number(lastCheck) < 1000 * 60 * 60) return;
			localStorage.setItem("bplus_last_version_check", String(now));
			const response = await fetch(metaUrl);
			const metaText = await response.text();
			const match = metaText.match(/@version\s+([^\s]+)/);
			if (match) {
				const latestVersion = match[1];
				if (latestVersion !== currentVersion) {
					await Swal.fire({
						title: 'Доступна новая версия скрипта!',
						html: `<img src="https://raw.githubusercontent.com/2elnwndrer/bpls/refs/heads/main/stickers/finish_tutorial.webp" width="200"><br><br><b>Текущая версия:</b> ${currentVersion}<br><b>Новая версия:</b> ${latestVersion}<br><br>Обновите скрипт до последней версии и пользуйтесь новыми функциями.<br>`,
						confirmButtonText: 'Обновить сейчас',
						confirmButtonColor: '#22c55e',
						didOpen: applySwalStyles
					}).then((result) => {
						if (result.isConfirmed) {
							window.open('https://greasyfork.org/scripts/533532', '_blank');
						}
					});
				}
			}
		} catch (err) {
			console.warn('Не удалось проверить обновления:', err);
		}
	}

	if (!window.Swal) {
		await new Promise(resolve => {
			const sweetalertScript = document.createElement('script');
			sweetalertScript.src = 'https://cdn.jsdelivr.net/npm/sweetalert2@11';
			sweetalertScript.onload = resolve;
			document.head.appendChild(sweetalertScript);
		});
	}

	const applySwalStyles = () => {
		const popup = document.querySelector('.swal2-popup');
		if (popup) {
			popup.style.backdropFilter = "blur(20px) saturate(200%)";
			popup.style.webkitBackdropFilter = "blur(20px) saturate(200%)";
			popup.style.backgroundColor = "rgba(255, 255, 255, 0.45)";
			popup.style.borderRadius = "12px";
			popup.style.border = "1px solid rgba(209, 213, 219, 0.3)";
		}
	};

	await checkForUpdates();

	const cached = JSON.parse(localStorage.getItem("bplus_auth"));
	const now = Date.now();
	if (cached && cached.expires > now) {
		const script = document.createElement('script');
		script.textContent = cached.script;
		document.head.appendChild(script);
		observeLogoutButton();
		return;
	}

	let authenticated = false;
	while (!authenticated) {
		const { value: formValues, isConfirmed } = await Swal.fire({
			title: 'Авторизация',
			html: `
				<img src="https://raw.githubusercontent.com/2elnwndrer/bpls/main/stickers/authduckanim.webp" width="200"><br><br>
				Укажите логин и пароль <b>ОТ СКРИПТА</b> для доступа к полной версии.<br>
				<input id="swal-login" class="swal2-input" type="text" placeholder="Логин">
				<input id="swal-password" class="swal2-input" type="password" placeholder="Пароль">`,
			footer: `Если у вас нет логина и пароля от скрипта <a href="#" id="request-access-link" style="color:#2563eb;text-decoration:underline;">запросите доступ</a>!`,
			confirmButtonText: 'Войти',
			showCancelButton: true,
			cancelButtonText: 'Отмена',
			focusConfirm: false,
			preConfirm: () => {
				const login = document.getElementById('swal-login').value.trim();
				const password = document.getElementById('swal-password').value.trim();
				if (!login || !password) {
					Swal.showValidationMessage(`Введите логин и пароль от <b>скрипта</b>`);
					return false;
				}
				return { login, password };
			},
			didOpen: () => {
				applySwalStyles();
				setTimeout(() => {
					const link = document.getElementById("request-access-link");
					if (link) {
						link.addEventListener("click", async (e) => {
							e.preventDefault();
							const { value: values, isConfirmed } = await Swal.fire({
								title: 'Запрос доступа',
								html: `
  <div style="text-align: center;">
    <img src="https://raw.githubusercontent.com/2elnwndrer/bpls/refs/heads/main/stickers/askforaccess.webp" width="200"><br><br>
    <div style="text-align: left; display: inline-block;">
      <label>
        Желаемый логин:
        <i class="fa fa-info-circle info-icon" data-tooltip="Введите логин который будет использоваться для авторизации в скрипте."></i>
      </label><br>
      <input id="desired-login" type="text" class="swal2-input"><br>

      <label>
        Желаемый пароль:
        <i class="fa fa-info-circle info-icon" data-tooltip="Придумайте надёжный пароль."></i>
      </label><br>
      <input id="desired-password" type="text" class="swal2-input"><br>

      <label>
        Ваше ФИО:
        <i class="fa fa-info-circle info-icon" data-tooltip="Введите ваши фамилию, имя и отчество полностью. Прямо как журнале. Это важно!"></i>
      </label><br>
      <input id="desired-name" type="text" class="swal2-input"><br>

      <label>
        Почта для связи:
        <i class="fa fa-info-circle info-icon" data-tooltip="Данные для входа будут отправлены Вам на указанную почту."></i>
      </label><br>
      <input id="desired-email" class="swal2-input" type="email">
    </div>
  </div>
`,
            footer: `<div style="
            display: flex;
            align-items: center;
            background-color: #fff5f5;
            border-left: 6px solid #e53935;
            padding: 12px 16px;
            margin: 10px 0;
            font-family: sans-serif;
            color: #333;
            border-radius: 4px;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
            font-size: 14px;
            line-height: 1.5;
            opacity: 0;
            transform: translateX(20px);
            animation: slideIn 0.6s ease-out forwards;
          ">
            Для безопасности создайте уникальные учетные данные, не совпадающие с логином и паролем от электронного журнала.
          </div>

          <style>
          @keyframes slideIn {
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
          </style>
          `,
                confirmButtonText: 'Отправить заявку',
								showCancelButton: true,
								cancelButtonText: 'Отмена',
								preConfirm: () => {
									const login = document.getElementById('desired-login').value.trim();
									const pass = document.getElementById('desired-password').value.trim();
									const name = document.getElementById('desired-name').value.trim();
									const email = document.getElementById('desired-email').value.trim();
									if (!login || !pass || !name || !email) {
										Swal.showValidationMessage('Пожалуйста, заполните все поля!');
										return false;
									}
									return { login, pass, name, email };
								},
								didOpen: () => {
  applySwalStyles();

  document.querySelectorAll('.info-icon').forEach(icon => {
    const tooltip = document.createElement('div');
    tooltip.style.position = 'absolute';
    tooltip.style.backgroundColor = '#333';
    tooltip.style.color = '#fff';
    tooltip.style.padding = '5px 10px';
    tooltip.style.borderRadius = '4px';
    tooltip.style.fontSize = '12px';
    tooltip.style.zIndex = '10000';
    tooltip.style.whiteSpace = 'nowrap';
    tooltip.style.boxShadow = '0px 0px 10px rgba(0, 0, 0, 0.1)';
    tooltip.style.display = 'none';
    tooltip.innerHTML = icon.dataset.tooltip;
    document.body.appendChild(tooltip);

    icon.addEventListener('mouseover', () => {
      tooltip.style.display = 'block';
    });

    icon.addEventListener('mouseout', () => {
      tooltip.style.display = 'none';
    });

    icon.addEventListener('mousemove', e => {
      tooltip.style.left = e.pageX + 10 + 'px';
      tooltip.style.top = e.pageY + 10 + 'px';
    });
  });
}
							});

							if (isConfirmed && values) {
								const msg =
  `📨 Заявка на доступ к скрипту:\n\n` +
  `👤 ФИО: \`${values.name}\`\n` +
  `🔐 Логин: \`${values.login}\`\n` +
  `🗝️ Пароль: \`${values.pass}\`\n` +
  `📧 Почта: \`${values.email}\``;

								sendTelegramMessage(msg);

								const loadingSwal = Swal.fire({
									title: 'Отправка заявки...',
									html: `<img src="https://raw.githubusercontent.com/2elnwndrer/bpls/main/stickers/send_message_finish.webp" width="200"><br><br>Пожалуйста, подождите...`,
									allowOutsideClick: false,
									didOpen: () => {
										Swal.showLoading();
										applySwalStyles();
									}
								});

								setTimeout(async () => {

									loadingSwal.close();

									await Swal.fire({
										title: 'Заявка отправлена!',
										html: `<img src="https://raw.githubusercontent.com/2elnwndrer/bpls/main/stickers/success_duckThumbsUp.webp" width="200"><br><br>Спасибо! Данные для входа будут отправлены вам на указанную почту.<br>Не получили письмо в течение дня? Загляните в папку «Спам» — оно могло попасть туда.`,
										timer: 5000,
										showConfirmButton: false,
										didOpen: applySwalStyles
									});

									setTimeout(() => {
										window.location.reload();
									}, 2000);
								}, 3000);
							}
						});
					}
				}, 100);
			}
		});

		if (!isConfirmed || !formValues) return;
		const { login, password } = formValues;
		const nameFromPage = document.querySelector('.main-header-user-title a span')?.textContent.trim();

		try {
			const response = await fetch(authApiUrl, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ login, password, nameOnPage: nameFromPage })
			});
			const result = await response.json();

			if (!response.ok) {
				await Swal.fire({
					title: 'Ошибка',
					html: `<img src="https://raw.githubusercontent.com/2elnwndrer/bpls/refs/heads/main/stickers/userisnotallowed.webp" width="200"><br>${result.error}`,
					didOpen: applySwalStyles
				});
				continue;
			}

			await Swal.fire({
				title: 'Авторизация завершена!',
				html: `<img src="https://raw.githubusercontent.com/2elnwndrer/bpls/refs/heads/main/stickers/authduckanim.webp" width="200"><br><br>Добро пожаловать!`,
				showConfirmButton: true,
				didOpen: applySwalStyles
			});


			localStorage.setItem("bplus_auth", JSON.stringify({
				script: result.script,
				expires: now + 1000 * 60 * 60 * 24 * 3
			}));

			const script = document.createElement('script');
			script.textContent = result.script;
			document.head.appendChild(script);
			authenticated = true;
			observeLogoutButton();

		} catch (error) {
			console.error('Ошибка авторизации:', error);
			await Swal.fire({
				icon: 'error',
				title: 'Ошибка',
				text: 'Не удалось подключиться к серверу.',
				didOpen: applySwalStyles
			});
		}
	}

	function observeLogoutButton() {
	const observer = new MutationObserver(() => {
		const logoutBtn = document.querySelector('a.btn.btn-orange[href="/auth/logout"]');
		if (logoutBtn && !logoutBtn.dataset.authResetHandled) {
			logoutBtn.addEventListener('click', () => {
				localStorage.removeItem("bplus_auth");
			});
			logoutBtn.dataset.authResetHandled = "true";
		}
	});
	observer.observe(document.body, {
		childList: true,
		subtree: true
	});
}
}



			const sweetalertScript = document.createElement('script');
			sweetalertScript.src = 'https://cdn.jsdelivr.net/npm/sweetalert2@11';
			document.head.appendChild(sweetalertScript);

const inputFieldSecretwordscreen = document.getElementById("SecretWordVerificationForm_secret_word");

if (inputFieldSecretwordscreen) {
    const buttonSecretwordscreen = document.createElement("button");
    buttonSecretwordscreen.className = "btn btn-orange btn-small";
    buttonSecretwordscreen.style.marginLeft = "5px";
    buttonSecretwordscreen.innerHTML = '<i class="fa fa-angle-double-down" aria-hidden="true"></i>';
    buttonSecretwordscreen.type = "button";

    const containerSecretwordscreen = inputFieldSecretwordscreen.parentElement;
    containerSecretwordscreen.style.display = "flex";
    containerSecretwordscreen.style.alignItems = "center";
    containerSecretwordscreen.style.position = "relative";
    containerSecretwordscreen.appendChild(buttonSecretwordscreen);

    const dropdownSecretwordscreen = document.createElement("div");
    dropdownSecretwordscreen.style.display = "none";
    dropdownSecretwordscreen.style.position = "absolute";
    dropdownSecretwordscreen.style.background = "white";
    dropdownSecretwordscreen.style.border = "1px solid #ccc";
    dropdownSecretwordscreen.style.borderRadius = "8px";
    dropdownSecretwordscreen.style.padding = "10px";
    dropdownSecretwordscreen.style.marginTop = "5px";
    dropdownSecretwordscreen.style.boxShadow = "0px 4px 6px rgba(0,0,0,0.1)";
    dropdownSecretwordscreen.style.minWidth = "200px";
    dropdownSecretwordscreen.style.left = "0";
    dropdownSecretwordscreen.style.top = "100%";
    dropdownSecretwordscreen.style.zIndex = "1000";
    dropdownSecretwordscreen.style.overflow = "hidden";

    const closeButtonSecretwordscreen = document.createElement("button");
    closeButtonSecretwordscreen.textContent = "×";
    closeButtonSecretwordscreen.className = "btn btn-small btn-danger";
    closeButtonSecretwordscreen.style.position = "absolute";
    closeButtonSecretwordscreen.style.top = "5px";
    closeButtonSecretwordscreen.style.right = "5px";
    closeButtonSecretwordscreen.style.width = "20px";
    closeButtonSecretwordscreen.style.height = "20px";
    closeButtonSecretwordscreen.style.fontSize = "12px";
    closeButtonSecretwordscreen.style.padding = "0";
    closeButtonSecretwordscreen.style.borderRadius = "3px";
    closeButtonSecretwordscreen.style.border = "none";
    closeButtonSecretwordscreen.style.background = "red";
    closeButtonSecretwordscreen.style.color = "white";
    closeButtonSecretwordscreen.type = "button";
    closeButtonSecretwordscreen.addEventListener("click", function () {
        dropdownSecretwordscreen.style.display = "none";
    });

    const listContainerSecretwordscreen = document.createElement("div");
    listContainerSecretwordscreen.style.marginTop = "10px";

    let savedItemsSecretwordscreen = JSON.parse(localStorage.getItem("dropdownItems")) || [];
    savedItemsSecretwordscreen.forEach(text => addDropdownItemSecretwordscreen(text));

    const addButtonSecretwordscreen = document.createElement("button");
    addButtonSecretwordscreen.textContent = "+";
    addButtonSecretwordscreen.className = "btn btn-small btn-success";
    addButtonSecretwordscreen.style.width = "100%";
    addButtonSecretwordscreen.style.marginTop = "5px";
    addButtonSecretwordscreen.type = "button";
    addButtonSecretwordscreen.addEventListener("click", function () {
        Swal.fire({
            title: `Введите секретное слово`,
            input: "text",
            showCancelButton: true,
            confirmButtonText: "Добавить",
            cancelButtonText: "Отмена",
          didOpen: () => {
                            const e = Swal.getPopup();
                            e.style.backdropFilter = "blur(20px) saturate(200%)", e.style.webkitBackdropFilter = "blur(20px) saturate(200%)", e.style.backgroundColor = "rgba(255, 255, 255, 0.45)", e.style.borderRadius = "12px", e.style.border = "1px solid rgba(209, 213, 219, 0.3)"
                        }
        }).then((result) => {
            if (result.isConfirmed && result.value) {
                addDropdownItemSecretwordscreen(result.value);
                savedItemsSecretwordscreen.push(result.value);
                localStorage.setItem("dropdownItems", JSON.stringify(savedItemsSecretwordscreen));
            }
        });
    });

    function addDropdownItemSecretwordscreen(text) {
        const itemContainerSecretwordscreen = document.createElement("div");
        itemContainerSecretwordscreen.style.display = "flex";
        itemContainerSecretwordscreen.style.alignItems = "center";
        itemContainerSecretwordscreen.style.justifyContent = "space-between";
        itemContainerSecretwordscreen.style.padding = "8px";
        itemContainerSecretwordscreen.style.borderBottom = "1px solid #ddd";

        const itemTextSecretwordscreen = document.createElement("span");
        itemTextSecretwordscreen.textContent = text;
        itemTextSecretwordscreen.style.cursor = "pointer";
        itemTextSecretwordscreen.style.flexGrow = "1";
        itemTextSecretwordscreen.addEventListener("click", function () {
            inputFieldSecretwordscreen.value = text;
        });

        const deleteButtonSecretwordscreen = document.createElement("button");
        deleteButtonSecretwordscreen.innerHTML = '<i class="fa fa-trash" aria-hidden="true"></i>';
        deleteButtonSecretwordscreen.className = "btn btn-small";
        deleteButtonSecretwordscreen.style.position = "absolute";
        deleteButtonSecretwordscreen.style.right = "5px";
        deleteButtonSecretwordscreen.style.marginLeft = "5px";
        deleteButtonSecretwordscreen.style.padding = "0";
        deleteButtonSecretwordscreen.style.fontSize = "12px";
        deleteButtonSecretwordscreen.style.background = "none";
        deleteButtonSecretwordscreen.style.border = "none";
        deleteButtonSecretwordscreen.style.color = "red";
        deleteButtonSecretwordscreen.style.display = "flex";
        deleteButtonSecretwordscreen.style.alignItems = "center";
        deleteButtonSecretwordscreen.addEventListener("click", function () {
            listContainerSecretwordscreen.removeChild(itemContainerSecretwordscreen);
            savedItemsSecretwordscreen = savedItemsSecretwordscreen.filter(item => item !== text);
            localStorage.setItem("dropdownItems", JSON.stringify(savedItemsSecretwordscreen));
        });

        itemContainerSecretwordscreen.appendChild(itemTextSecretwordscreen);
        itemContainerSecretwordscreen.appendChild(deleteButtonSecretwordscreen);
        listContainerSecretwordscreen.appendChild(itemContainerSecretwordscreen);
    }

    dropdownSecretwordscreen.appendChild(closeButtonSecretwordscreen);
    dropdownSecretwordscreen.appendChild(listContainerSecretwordscreen);
    dropdownSecretwordscreen.appendChild(addButtonSecretwordscreen);
    containerSecretwordscreen.appendChild(dropdownSecretwordscreen);

    buttonSecretwordscreen.addEventListener("click", function (event) {
        event.preventDefault();
        dropdownSecretwordscreen.style.display = dropdownSecretwordscreen.style.display === "none" ? "block" : "none";
    });
}