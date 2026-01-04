// ==UserScript==
// @name         Share GPT Links Panel
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  蹦擦擦小分队专用
// @author       Your name
// @match        https://vn.xiaoyu.uk/*
// @grant        none
// @license      禁止外部传播
// @downloadURL https://update.greasyfork.org/scripts/514701/Share%20GPT%20Links%20Panel.user.js
// @updateURL https://update.greasyfork.org/scripts/514701/Share%20GPT%20Links%20Panel.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建样式
    const style = document.createElement('style');
    style.textContent = `
        .share-gpt-button {
            position: fixed;
            top: 12px;
            right: 20px;
            padding: 8px 16px;
            background: #10a37f;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            display: flex;
            align-items: center;
            gap: 6px;
            z-index: 1000;
            transition: background-color 0.2s;
        }

        .share-gpt-button:hover {
            background: #0e8c6d;
        }

        .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.7);
            display: none;
            justify-content: center;
            align-items: center;
            z-index: 1001;
        }

        .modal-content {
            background: #1a1a1a;
            border-radius: 8px;
            width: 90%;
            max-width: 1200px;
            max-height: 80vh;
            overflow-y: auto;
            padding: 20px;
            position: relative;
        }

        .modal-close {
            position: absolute;
            top: 12px;
            right: 12px;
            background: none;
            border: none;
            color: #888;
            cursor: pointer;
            padding: 4px;
            border-radius: 4px;
        }

        .modal-close:hover {
            color: #fff;
            background: #333;
        }

        .modal-title {
            color: #fff;
            font-size: 18px;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 1px solid #333;
        }

        .link-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 16px;
            padding: 16px 0;
        }

        .link-card {
            background: #2a2a2a;
            border: 1px solid #333;
            border-radius: 8px;
            padding: 12px;
            transition: all 0.2s;
            cursor: pointer;
        }

        .link-card:hover {
            background: #333;
            border-color: #444;
            transform: translateY(-2px);
        }

        .card-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
        }

        .card-id {
            font-size: 14px;
            color: #e0e0e0;
            font-weight: 500;
        }

        .progress-bar {
            width: 100%;
            height: 8px;
            background: #333;
            border-radius: 4px;
            overflow: hidden;
        }

        .progress {
            width: 70%;
            height: 100%;
            background: #22c55e;
            border-radius: 4px;
        }

        .card-footer {
            display: flex;
            justify-content: space-between;
            margin-top: 8px;
            font-size: 12px;
            color: #888;
        }

        /* 滚动条样式 */
        .modal-content::-webkit-scrollbar {
            width: 8px;
        }

        .modal-content::-webkit-scrollbar-track {
            background: #1a1a1a;
        }

        .modal-content::-webkit-scrollbar-thumb {
            background: #333;
            border-radius: 4px;
        }

        .modal-content::-webkit-scrollbar-thumb:hover {
            background: #444;
        }
    `;
    document.head.appendChild(style);

    // 链接数据
    const links = [
"https://plus.aivvm.com/auth/login_share?token=fk-rvOQwp7aYYk9RzHIyBXaLCzhZq5l5gHPzaSMglQha7o",
"https://plus.aivvm.com/auth/login_share?token=fk-gzDnKOnRrtAasrNhsvR-ZvHtpR8iaRcLcCQ2E0LKTg8",
"https://plus.aivvm.com/auth/login_share?token=fk-AJz_VMsHBQZLzdJWbOd8654WbnN8fZD7UV4LE2wNkKE",
"https://plus.aivvm.com/auth/login_share?token=fk-hq9GaeObx5iGYA_3esF32y81vqL-v_HZ5Vg31xJbmhk",
"https://plus.aivvm.com/auth/login_share?token=fk-x5wlKqy055wjNzKx0Kgx0gGboMOc0g3smyp1Up6tu7A",
"https://plus.aivvm.com/auth/login_share?token=fk-rdvnuozEMthlTPRHpzFIvmKOGmvEoyTDbnd6tq5H8DY",
"https://plus.aivvm.com/auth/login_share?token=fk--zyyie-4XqnPABxYH6jLYPghXFa7w4mzs0rLIrHLml4",
"https://plus.aivvm.com/auth/login_share?token=fk-0ZcJ7_nIH-VfrDOzjTApBMD6pEvQReOPhV4v5oXRSS0",
"https://plus.aivvm.com/auth/login_share?token=fk-TkL73xeyUeOMlxVCOtFg3BxLH_ug6RXT5GiN2RWOCBc",
"https://plus.aivvm.com/auth/login_share?token=fk-aTqc_Ke2g6bNhewFPSvHB6ehDV43salvWlR1DAY0JDg",
"https://plus.aivvm.com/auth/login_share?token=fk-TuqGCIsIgas2Fu9Whk78mARIqfB4SVrv8UpKqb4wXOk",
"https://plus.aivvm.com/auth/login_share?token=fk-CGQQY-atodBGFS36Tdrlc3vzf6eZg1arxEcOvlLpYGw",
"https://plus.aivvm.com/auth/login_share?token=fk-H57kf3Wr6448IZcQ5bYO_ZEoH_ii2tPYSv5NVaXBdS4",
"https://plus.aivvm.com/auth/login_share?token=fk-sODdZsBDhhWgMYvtE3aGDKn7HAxjcFAlnYx7WSVVl7M",
"https://plus.aivvm.com/auth/login_share?token=fk-JP5kmRTnx5xO1xxhdMe1DE2bmgXArPBe_xlOvXF97TE",
"https://plus.aivvm.com/auth/login_share?token=fk-elZrbey0l-3JR878dzclPya8fCJlJHOJbZUUTv0pd6k",
"https://plus.aivvm.com/auth/login_share?token=fk-m00V7SeD8ucJ_ZKPtulSStYpo4Q_dTMu234dg1-JU28",
"https://plus.aivvm.com/auth/login_share?token=fk-V1nju_Tm6TYokKZr-KaYnivBOVtZUyPfrAwxDVsyPkU",
"https://plus.aivvm.com/auth/login_share?token=fk-2QqWjVVxlf9Aaonft7g1a4aoKgkccNpqGi21sInQo1Y",
"https://plus.aivvm.com/auth/login_share?token=fk-AOSXzNRXi2Ayvhw5qyW_VQ93ZqxXAN8KiSYxdIgSrNo",
"https://plus.aivvm.com/auth/login_share?token=fk-EFs27KcK9aBPH7cxcbjBXBbmuzaX7YQxLax0G-9W7FY",
"https://plus.aivvm.com/auth/login_share?token=fk-BHDUzgp-EFyRejf0CiVgZVuQWFioVUowBTn_xh4iSj0",
"https://plus.aivvm.com/auth/login_share?token=fk-rARJqb81CrTrxxAbMQG2qoNG3mJp7dd_GHD9eLkBrtQ",
"https://plus.aivvm.com/auth/login_share?token=fk-exyaKlM06F4fy_0UB3WMZyLhqmgBVlb5d4lQk7S5sQA",
"https://plus.aivvm.com/auth/login_share?token=fk-f1BdAVFp_E-JXLdIf7KRTyCsjlsxftpEy7lI9J2COf8",
"https://plus.aivvm.com/auth/login_share?token=fk-fgEjnpAqb3vJEijC9__gNhW9S_VU5Tv3mKt_cXiXwrQ",
"https://plus.aivvm.com/auth/login_share?token=fk-HSFjuY8sRYJ97YsMfW8_CPexwYH3A2nN26AGZFUdh-4",
"https://plus.aivvm.com/auth/login_share?token=fk-gX-Z5NGRW0lgkuPZTSJ7Rf_I59h8Q1_76gxRBrVUF4w",
"https://plus.aivvm.com/auth/login_share?token=fk-Bs43NjlrqFqcLkaRw5gz-HSberYL36P7yXTV1PDpg3g",
"https://plus.aivvm.com/auth/login_share?token=fk-R10eeqQkTAxMfYTDPZB2TMvZzBXEMOzH9kpz9RklkW8",
"https://plus.aivvm.com/auth/login_share?token=fk-JAKUmwB7r6tC1saVbQTMJD-nAdV7zqzzA_4zi8bQH9s",
"https://plus.aivvm.com/auth/login_share?token=fk-E-96LFo3D9de_imfx_VFHDkWBSsLIqMr6a3USAz20Kc",
"https://plus.aivvm.com/auth/login_share?token=fk-mAuBY6b1oET4rEhyquXHbEt1cSPkGFqN9Rat4F2o27E",
"https://plus.aivvm.com/auth/login_share?token=fk-grH_q_tjS06C2JXzQ1LPJCyrrswgtMgo-gTUKr-xwE8",
"https://plus.aivvm.com/auth/login_share?token=fk-IzsvF3fGOPjOdCUKId77LaFpstb4XvLthLvUpfAyxTI",
"https://plus.aivvm.com/auth/login_share?token=fk-yggbzxtOyAszLt-oCqWuSLHWSJKn-fE3Izf5sCaWbG4",
"https://plus.aivvm.com/auth/login_share?token=fk-p9Z1A4nE2SG6YVpyPaeWUwMLGS5JNaLjrl5D99KCXlc",
"https://plus.aivvm.com/auth/login_share?token=fk-wdSkgPkn2ON2HS52JI2vYgQAluWjD89Y4Lp-UkafhPo",
"https://plus.aivvm.com/auth/login_share?token=fk-17wuLiGEEN0Q4ZtgffDP0tKUE8QHwcTfg2cLSL1FfVk",
"https://plus.aivvm.com/auth/login_share?token=fk-ObGuF8ZL-q6LgPA8P6ZL8egV7lcIaq5yTCY0_inFX1Q",
"https://plus.aivvm.com/auth/login_share?token=fk-QQPWei9bA_QUk4fYySw1WoxSLps5L1Rzrm1nsgsmLsM",
"https://plus.aivvm.com/auth/login_share?token=fk-sqD0Dzzk_eaJz9uJZ3ewWQZqHB8AINvRrEjKO0EqpYE",
"https://plus.aivvm.com/auth/login_share?token=fk-t7Q4-_cQc40EkYqMVZLY_CRQBsIE1dROvvHFLciHzgc",
"https://plus.aivvm.com/auth/login_share?token=fk-KFgYHfb89ZpE8bbR3KphqTxz_GD17_kS_DtBhkLQvEQ",
"https://plus.aivvm.com/auth/login_share?token=fk-rI9l-kTfVH9-FX5WPqscJkxc3jsVwlTypqvfN-3_bQA",
"https://plus.aivvm.com/auth/login_share?token=fk-rkAonJiNecLUjOJAdTC-LgnKLcZMNKEcjCYFBrfACJg",
"https://plus.aivvm.com/auth/login_share?token=fk-qlJ_MQeFVgSYXkpTE7TGrY2oKquWCN0aV6WryFRxqoE",
"https://plus.aivvm.com/auth/login_share?token=fk-vwcpXrgEdSl6ZRs2chzyQa71q8eQVRh_U3A9gHEhrZE",
"https://plus.aivvm.com/auth/login_share?token=fk-hq7lDgbuXWlQWLVW435nmAJgVFWXOUU3-ZH7hKzp6O0",
"https://plus.aivvm.com/auth/login_share?token=fk-Aiz4iGoqfgGeydPzfNX2nfm2HJH8wSLNGrxAzjdajCo",
"https://plus.aivvm.com/auth/login_share?token=fk-Z-6DRoqk8OrVe7yXbGjNHH88gDLSO_nvdHXnLEX7uy0",
"https://plus.aivvm.com/auth/login_share?token=fk-F9820xTI2rPtozo-24wciKMDuvrOh_V_lmoineuDKMk",
"https://plus.aivvm.com/auth/login_share?token=fk-vcFRiGOtB3TOPh1lVCNx_VPjhfkrE-v-FDweapoPpZw",
"https://plus.aivvm.com/auth/login_share?token=fk-Vbjhk1OXupdquiBt8tB3Sk7Ond8aQhntSHRjVe9vLjE",
"https://plus.aivvm.com/auth/login_share?token=fk-vrTel4XHVE1HKTB9qjKeA9UIqpfS5QokI0c6Ikcu7qs",
"https://plus.aivvm.com/auth/login_share?token=fk-tanl0EVZyI_4W_iiDMFu4rJC7qPykfTwS_R8qVBeNic",
"https://plus.aivvm.com/auth/login_share?token=fk-YlFOTKHEwH6qeIg8HQyNAeGx1F0K9e88XvKdF6FkwEs",
"https://plus.aivvm.com/auth/login_share?token=fk-woVBu7hdfzY0Gy2I74n2YkjdZa_hqRG8u1mHIZI1Cxk",
"https://plus.aivvm.com/auth/login_share?token=fk-0Or9ezAMomTDfp27_65M3ULhXPZFB9KPISlC1phSAw0",
"https://plus.aivvm.com/auth/login_share?token=fk-oT_DTpTUBtLaXvhwLcC2ko83Bfj1tBXQbFWPECULRc4",
"https://plus.aivvm.com/auth/login_share?token=fk-UC8xjh5NskrvcLEtfLD1oODwP0dN6jJyr211-0XEOg4",
"https://plus.aivvm.com/auth/login_share?token=fk-_VA6O41ab55i6esS4sInccujeCuv7vwFeVVsKHXOng4",
"https://plus.aivvm.com/auth/login_share?token=fk-g3OBBhA6-CRXtCstx5-OPomb1Su4SuyL3VO9TCivkY0",
"https://plus.aivvm.com/auth/login_share?token=fk-VBe8K_wGzJRMyYbfVMChG2qThRzyOKUDmXVHKvacX8c",
"https://plus.aivvm.com/auth/login_share?token=fk-t7Ea8GnKZxvtQwwLuJxjE7K-K1S6vu6XWbpx7fMaiZI",
"https://plus.aivvm.com/auth/login_share?token=fk-J1_v-Zxlfuc1tkf-cfzRbN9PWTK6pgX4XtAcGaONlVs",
"https://plus.aivvm.com/auth/login_share?token=fk-k1VVSJEFf6XYPJt9vymQBHCjW514RYKztDjn8qoOpXo",
"https://plus.aivvm.com/auth/login_share?token=fk-e7_peCZinpZ5PXK0_tPywuMA0eIQYHUaX2URRBMLxr4",
"https://plus.aivvm.com/auth/login_share?token=fk-ne0vyc5O6Q7dWSsPlCMLnO-MzWJCpT1eHtXbqS2OmPY",
"https://plus.aivvm.com/auth/login_share?token=fk-7rupiLL8DteeHXC3wBF_n83VE05EWMwdg7SDHC1TJgE",
"https://plus.aivvm.com/auth/login_share?token=fk-_WT0nBDQBTjwLwNBreWzQyTHFqFgpRbtOTvEYGgTsfA",
"https://plus.aivvm.com/auth/login_share?token=fk-fuIvkt2s4gtbjv5t8pGh3Z3PSAqsepVQ_kZ3AcIOBWs",
"https://plus.aivvm.com/auth/login_share?token=fk-hutJWXo7xQwNsuox7CRs_ShOHthphkK8kzaS_WmV6L4",
"https://plus.aivvm.com/auth/login_share?token=fk-SCC1j4fs9p9Hj2SksILAlUCUJ2-Ligqn3pkydRd3ClE",
"https://plus.aivvm.com/auth/login_share?token=fk-O_-pm27--PKxRz3W-RGqaTa6QZon2EI2c7KDW-D0mHg",
"https://plus.aivvm.com/auth/login_share?token=fk-zZ_OdieOoSb3-UA4_aezOLAoNB3kWs7eVXVyBbnVK6w",
"https://plus.aivvm.com/auth/login_share?token=fk-tUI1WERfk7ot2_Huu3_ngrpdoiHVC5sy--lpCdgtJ8o",
"https://plus.aivvm.com/auth/login_share?token=fk-3scBrqqIelet2_MClHLkEGXHtImuo3njmdMIIRpqMcU",
"https://plus.aivvm.com/auth/login_share?token=fk-rhBzRm6gtPl37K3qGVnfwk8x2IXWu2ODpQSLeaoX0dg",
"https://plus.aivvm.com/auth/login_share?token=fk-nux4aNq20WI0RB7DSXKfVg1vcRku_eYbwp3V2IbAEZA",
"https://plus.aivvm.com/auth/login_share?token=fk-9q06xDeO4hMT2-GKSnm-fjMmfC9-hQjCUcZq2cPj-Lc",
"https://plus.aivvm.com/auth/login_share?token=fk-InXdeJS5kLMyzVS0k9YQPd3E0Se-cmg-tnoZ--y1nnw",
"https://plus.aivvm.com/auth/login_share?token=fk-lhckGclwIfWDutiNTrF1TTP5X4yAUx12hUHIx8VlmcQ",
"https://plus.aivvm.com/auth/login_share?token=fk-UydM5BIwE6jMjwJqhs0Vy8ZAryZ4AQ8WcrihAo-ydT4",
"https://plus.aivvm.com/auth/login_share?token=fk-UqkgJTfQEw-jTXM6bVKTdPUxMZtx1EqGJ7HrX0WmqK0",
"https://plus.aivvm.com/auth/login_share?token=fk-TOk6_gMVkfUIUNWVcIlzKLsPu6e0_Ek3bFgK8KB2SBg",
"https://plus.aivvm.com/auth/login_share?token=fk-FAsO6BhOIrKd6zW6CdFuPAmiHhmuBMME1ZoTGZbHdkE",
"https://plus.aivvm.com/auth/login_share?token=fk-r5Wx9CqhgAQKNjSOWna6nRFeTBpcleWeawVFRwjb1ZI",
"https://plus.aivvm.com/auth/login_share?token=fk-2lZPJV3cvth5N7k0rcMTcmChFEd1-JQMYzLd9HvIp6w",
"https://plus.aivvm.com/auth/login_share?token=fk-tQva3hB_pdmYSNw180VXffQ4aQ4os7lWHZ3Y_qk7hrg",
"https://plus.aivvm.com/auth/login_share?token=fk-eAQnMb_XbVTba_0fWtWkMSraNPUHUM28MFTtTV_fJbA",
"https://plus.aivvm.com/auth/login_share?token=fk-c2K1KBZPOlyk-NmEsH6flfhqTJjjKrWdUsxK6jFrFJc",
"https://plus.aivvm.com/auth/login_share?token=fk-FRbE_j9fNyzD4B-89amd9Fg5BOjmh-Qtdz2yIe2JFlE",
"https://plus.aivvm.com/auth/login_share?token=fk-gTQgA-noWz5YEBGRMP517r2kPFT8BEWekITnHWTGbsw",
"https://plus.aivvm.com/auth/login_share?token=fk-gzv4TNs4-iaOdgNYR97lSzKsnVjE4FnTdpd4ymAtQ4E",
"https://plus.aivvm.com/auth/login_share?token=fk-0FSWPe0hxnIYzepyVrkrqstpg93pxlwFCqO7zUOr9QA",
"https://plus.aivvm.com/auth/login_share?token=fk-1MUyAUoVdf0EXtc0llv9UJV-r9ZTYxgIuZ6cfXahr90",
"https://plus.aivvm.com/auth/login_share?token=fk-LhLAn3zuO3kHdyCmsXDQAKjbmJYUwbpSUjjyTF83UCA",
"https://plus.aivvm.com/auth/login_share?token=fk-1ikj8lV6--gw1Axm1eRjVooFP1l2nOKAqahg426CZpo",
"https://plus.aivvm.com/auth/login_share?token=fk-6nlLJpP7Pg01v1AdB-rEsgtq_Mfx7RmTBYkyqDb6m_g"
    ];

    // 创建右上角按钮
    function createButton() {
        const button = document.createElement('button');
        button.className = 'share-gpt-button';
        button.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                <polyline points="16 6 12 2 8 6"></polyline>
                <line x1="12" y1="2" x2="12" y2="15"></line>
            </svg>
            Share GPT
        `;
        return button;
    }

    // 创建模态框
    function createModal() {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content">
                <button class="modal-close">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
                <div class="modal-title">Share GPT Links</div>
                <div class="link-grid">
                    ${links.map(link => {
                        const id = Math.random().toString(36).substring(7);
                        return `
                            <div class="link-card" onclick="window.open('${link}', '_blank')">
                                <div class="card-header">
                                    <span class="card-id">${id}</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#888" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                                        <polyline points="15 3 21 3 21 9"></polyline>
                                        <line x1="10" y1="14" x2="21" y2="3"></line>
                                    </svg>
                                </div>
                                <div class="progress-bar">
                                    <div class="progress"></div>
                                </div>
                                <div class="card-footer">
                                    <span>空闲</span>
                                    <span>推荐</span>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
        return modal;
    }

    // 初始化
    function init() {
        const button = createButton();
        const modal = createModal();

        document.body.appendChild(button);
        document.body.appendChild(modal);

        // 点击按钮显示模态框
        button.addEventListener('click', () => {
            modal.style.display = 'flex';
        });

        // 点击关闭按钮隐藏模态框
        modal.querySelector('.modal-close').addEventListener('click', () => {
            modal.style.display = 'none';
        });

        // 点击遮罩层关闭模态框
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }

    // 等待页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();