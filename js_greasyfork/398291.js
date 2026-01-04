// ==UserScript==
// @name               Security Dashboard
// @name:zh-CN         Security Dashboard
// @description        Security Dashboard. Only for SAP internal using.
// @description:zh-CN  Security Dashboard。仅供SAP内部使用。
// @namespace          https://github.com/HaleShaw
// @version            3.0.9
// @author             HaleShaw
// @copyright          2020+, HaleShaw (https://github.com/HaleShaw)
// @license            AGPL-3.0-or-later
// @homepage           https://github.com/HaleShaw/TM-Security
// @supportURL         https://github.com/HaleShaw/TM-Security/issues
// @contributionURL    https://www.jianwudao.com/
// @icon               https://www.jenkins.io/favicon.ico
// @require            https://cdn.jsdelivr.net/npm/jquery/dist/jquery.min.js
// @require            https://cdn.jsdelivr.net/npm/html2canvas@1.0.0-rc.7/dist/html2canvas.min.js
// @require            https://greasyfork.org/scripts/398010-commonutils/code/CommonUtils.js?version=781197
// @match              https://gkeselfbilljenkins.jaas-gcp.cloud.sap.corp/security
// @connect            sonarce.wdf.sap.corp
// @connect            fortify.tools.sap
// @compatible	       Chrome
// @run-at             document-start
// @grant              GM_addStyle
// @grant              GM_xmlhttpRequest
// @grant              GM_setValue
// @grant              GM_getValue
// @grant              GM_notification
// @grant              GM_info
// @downloadURL https://update.greasyfork.org/scripts/398291/Security%20Dashboard.user.js
// @updateURL https://update.greasyfork.org/scripts/398291/Security%20Dashboard.meta.js
// ==/UserScript==

// ==OpenUserJS==
// @author             HaleShaw
// @collaborator       HaleShaw
// ==/OpenUserJS==

(function () {
    ('use strict');

    const title = GM_info.script.name;
    const jenkinsHost = 'https://gkeselfbilljenkins.jaas-gcp.cloud.sap.corp/';
    const loginUrl =
        'https://gkeselfbilljenkins.jaas-gcp.cloud.sap.corp/securityRealm/commenceLogin?from=%2F';
    const baseUrl = jenkinsHost + 'job/SelfBilling-Security/job/';
    const gitHost = 'https://github.wdf.sap.corp/SelfBilling/';
    const sonarHost = 'https://sonarce.wdf.sap.corp/sonar/';

    // The security stages responsed from BlueOcean API.
    const securityStages = {
        Fortify: 'Fortify',
        'OpenSourceDependency [BlackDuck]': 'BlackDuck',
        'OpenSourceDependency [whitesource]': 'Whitesource',
        Checkmarx: 'Checkmarx',
        'IPScan and PPMS': 'PPMS',
        OpenSourceVulnerability: 'Open'
    };

    // icon url
    const faviconIcon = 'https://cdn.jsdelivr.net/gh/HaleShaw/cdn/img/logo/32/TM-Security.ico';
    const sonarIcon = sonarHost + 'favicon.ico';
    const jenkinsIcon =
        'https://gkeselfbilljenkins.jaas-gcp.cloud.sap.corp/static/7ce2b5b0/favicon.ico';
    const fotifyIcon = 'https://fortify.tools.sap/ssc/images/favicon.ico';
    const blackDuckIcon = 'https://sap.blackducksoftware.com/blackduck.hub/favicon.png';
    const whitesourceIcon = 'https://saas.whitesourcesoftware.com/favicon.ico';
    const checkMarxIcon = 'https://cx.wdf.sap.corp/CxWebClient/favicon.ico';
    const consoleIcon =
        'https://gkeselfbilljenkins.jaas-gcp.cloud.sap.corp/static/4dda255b/images/24x24/document.png';
    const blueOceanIcon =
        'https://gkeselfbilljenkins.jaas-gcp.cloud.sap.corp/static/51568324/plugin/blueocean-rest-impl/images/48x48/blueocean.png';
    const ppmsIcon = 'https://i7p.wdf.sap.corp/ppmslight/assets/images/favicon/favicon.ico';
    const loadingIcon =
        'https://gkeselfbilljenkins.jaas-gcp.cloud.sap.corp/static/89dcfe11/images/spinner.gif';
    const warningIcon = 'https://www.easyicon.net/api/resizeApi.php?id=1186332&size=16';

    const projects = {
        Customizing: {
            backend: true,
            fullName: 'selfbilling-customizing-service',
            fortifyName: 'com.sap.cf.sales.self.billing-customizing master',
            fortifyId: '22970',
            blackDuck:
                'https://sap.blackducksoftware.com/api/projects/712b3138-85ea-41cf-91f3-433489a3a123/versions/25cbc38e-ec00-4567-993e-ccdccb5217cc/components',
            whitesource: 'https://saas.whitesourcesoftware.com/Wss/WSS.html#!project;id=1383199'
        },
        S4Retriever: {
            backend: true,
            fullName: 'selfbilling-s4retriever-service',
            fortifyName: 'com.sap.cf.sales.self.billing-s4retriever master',
            fortifyId: '22983',
            blackDuck:
                'https://sap.blackducksoftware.com/api/projects/b0497db7-1eb9-4e49-940f-5aeb4b1f710e/versions/b3265b46-5dad-469a-b5db-a4b2b2c4fd49/components',
            whitesource: 'https://saas.whitesourcesoftware.com/Wss/WSS.html#!project;id=3429220'
        },
        Transmission: {
            backend: true,
            fullName: 'selfbilling-transmission-receiver-service',
            fortifyName: 'com.sap.cf.sales.self.billing-transmission-receiver master',
            fortifyId: '23369',
            blackDuck:
                'https://sap.blackducksoftware.com/api/projects/7663fc60-8d35-4c73-84ff-d918e8af8739/versions/c69e0b22-f66e-4b0c-b3fa-60841c3a75f9/components',
            whitesource: 'https://saas.whitesourcesoftware.com/Wss/WSS.html#!project;id=1424370'
        },
        Confirmation: {
            backend: true,
            fullName: 'selfbilling-confirmation-service',
            fortifyName: 'com.sap.cf.sales.self.billing-confirmation-receiver master',
            fortifyId: '23964',
            blackDuck:
                'https://sap.blackducksoftware.com/api/projects/5e83de39-9d4a-4627-9439-518f2457dcef/versions/7118601b-f9d6-4c2a-9e67-61b28e3c6f94/components',
            whitesource: 'https://saas.whitesourcesoftware.com/Wss/WSS.html#!project;id=1636905'
        },
        Core: {
            backend: true,
            fullName: 'selfbilling-core-service',
            fortifyName: 'com.sap.cf.sales.self.billing-service master',
            fortifyId: '25454',
            blackDuck:
                'https://sap.blackducksoftware.com/api/projects/10cf5bcd-ee7d-47b1-8fa9-3df523632afb/versions/797dab37-936d-4dcc-a139-1c1e992e625e/components',
            whitesource: 'https://saas.whitesourcesoftware.com/Wss/WSS.html#!project;id=1474832'
        },
        Monitor: {
            backend: false,
            fullName: 'selfbilling-monitor-service',
            whitesource: 'https://saas.whitesourcesoftware.com/Wss/WSS.html#!project;id=1342813',
            checkmarx: 'https://cx.wdf.sap.corp/CxWebClient/portal#/projectState/82331/Summary'
        },
        Sender: {
            backend: false,
            fullName: 'com.sap.cf.sales.self.billing.sender',
            whitesource: 'https://saas.whitesourcesoftware.com/Wss/WSS.html#!project;id=1602959',
            checkmarx: 'https://cx.wdf.sap.corp/CxWebClient/portal#/projectState/60289/Summary'
        },
        'Sold-to Party': {
            backend: false,
            fullName: 'com.sap.cf.sales.self.billing.soldtoparty',
            whitesource: 'https://saas.whitesourcesoftware.com/Wss/WSS.html#!project;id=1274131',
            checkmarx: 'https://cx.wdf.sap.corp/CxWebClient/portal#/projectState/82381/Summary'
        },
        Tolerance: {
            backend: false,
            fullName: 'com.sap.cf.sales.self.billing.tolerancegroup',
            whitesource: 'https://saas.whitesourcesoftware.com/Wss/WSS.html#!project;id=1274132',
            checkmarx: 'https://cx.wdf.sap.corp/CxWebClient/portal#/projectState/91320/Summary'
        },
        General: {
            backend: false,
            fullName: 'com.sap.cf.sales.self.billing.general',
            whitesource: 'https://saas.whitesourcesoftware.com/Wss/WSS.html#!project;id=3275526',
            checkmarx: 'https://cx.wdf.sap.corp/CxWebClient/portal#/projectState/91322/Summary'
        },
        Report: {
            backend: false,
            fullName: 'com.sap.cf.sales.self.billing.report',
            whitesource: 'https://saas.whitesourcesoftware.com/Wss/WSS.html#!project;id=3415852',
            checkmarx: 'https://cx.wdf.sap.corp/CxWebClient/portal#/projectState/93993/Summary'
        }
    };

    let username;
    let password;

    const mainStyle = `
      .mainTitle {
        margin: 1rem 0;
        text-align: center;
      }

      .mainTitle>img {
        width: 32px !important;
        height: 32px !important;
      }

      .mainTitle>a {
        font-size: 2rem;
        font-weight: bold;
      }

      .mainTitle>span {
        margin-left: 0.5rem !important;
      }

      a {
        text-decoration: none;
      }

      .setting {
        text-align: center;
        margin-bottom: 0px;
      }

      .setting>span {
        margin-left: 15px;
      }

      .setting>input {
        width: 8rem;
      }

      button:hover {
        background: #3aa77f;
        border-color: #3aa77f;
      }

      button {
        color: #fff;
        background: #87d3b7;
        border: none;
        border-color: #87d3b7;
        padding: 3px 6px;
        margin-left: 15px;
        cursor: pointer;
        box-sizing: border-box;
        transition-property: all;
        transition-duration: .3s;
      }

      .projects {
        width: 1450px;
        margin: auto;
      }

      .serviceProject:after,
      .uiProject:after {
        content: '';
        display: block;
        clear: both;
        width: 0;
        height: 0;
        visibility: hidden;
      }

      .uiProject {
        margin-top: 15px;
      }

      .project {
        margin-top: 15px;
        float: left;
        width: 715px;
      }

      .project:nth-child(even) {
        margin-left: 20px;
      }

      .titleDiv {
        text-align: center;
        margin-left: 6rem;
      }

      .securityDiv {
        margin: 10px 0;
      }

      .title {
        font-weight: bold;
        font-size: 1.5rem;
        line-height: 2;
      }

      .key {
        font-weight: bold;
      }

      .status {
        margin-left: 0 !important;
      }

      .statusDiv>span:not(:first-child),
      .statusDiv>a,
      .key:not(:first-child),
      .buttonDiv>a:not(:first-child) {
        margin-left: 20px;
      }

      .main.success {
        background-color: #01aa01;
        color: white;
      }

      .unstable {
        color: #7c7c6b;
        background-color: #FAFACE;
      }

      .main.failed {
        background-color: red;
        color: white;
      }

      .main.progress {
        background-color: #b8c47f;
        color: white;
      }

      .msg {
        color: red;
      }

      .aborted {
        background-color: grey;
        color: white;
      }

      img {
        margin-bottom: -5px;
        width: 20px;
        height: 20px;
      }

      .subtitle {
        margin-left: 1rem;
      }

      .securityDetailStatus {
        font-size: 0.875rem;
        margin-left: 5px;
      }

      .securityDetailStatus>img {
        width: 16px;
        height: 16px;
      }

      .detailFather {
        position: relative;
      }

      .detailFather:hover {
        cursor: pointer;
      }

      .detailFather:hover .coverageTable,
      .detailFather:hover .fortifyTable,
      .detailFather:hover .whiteSourceTable,
      .detailFather:hover .ppmsTable {
        display: block;
      }

      .info {
        border-radius: 6px;
        border: 1px solid grey;
        margin-left: 2px;
        color: grey;
        font-size: 10px;
        position: absolute;
        width: 10px;
        height: 10px;
        text-align: center;
      }

      .hoverTable {
        position: absolute;
        background: lightyellow;
        padding: 10px;
        border: 1px solid #b5c9fe;
        color: #000;
        font-weight: initial;
        font-size: 0.85rem;
        text-align: left;
        margin-top: 0;
        margin-bottom: 0;
        z-index: 99;
        display: none;
      }

      .coverageTable {
        top: 5px;
        left: 100px;
      }

      .fortifyTable {
        top: 20px;
        left: 20px;
      }

      .whiteSourceTable {
        top: 15px;
        left: 80px;
      }

      .ppmsTable {
        top: 20px;
        left: 0px;
      }

      .hoverTable>thead>tr>td,
      .hoverTable>tbody>tr>td {
        border: none;
        white-space: nowrap;
      }

      .hoverTable>thead>tr>td {
        font-weight: bold;
        text-align: center;
      }

      table.coverageTable>tr>td:nth-child(3){
        text-align: right;
      }

      .wsFail {
        color: red;
      }

      .ppmsRed {
        color: red;
      }

      .ppmsGrey {
        background: #dddddd;
      }

      .ppmsYellow {
        background: yellow;
      }

      table.sonar {
        margin: auto;
        margin-top: 10px;
        width: 715px;
        text-align: center;
      }

      table.sonar>tr:nth-child(odd) {
        background-color:#F0F0F0;
        font-weight: bold;
      }

      td {
        padding: 5px 5px;
      }

      table.sonar, td {
        border:1px solid #b5c9fe;
	    border-collapse:collapse;
      }

      footer {
        margin: 20px 0px;
        text-align: center;
      }
    `;
    const loadingStyle = `
  body {
    margin: auto;
  }

  .loading {
    display: none;
    z-index: 10000;
    height: 100%;
    width: 100%;
    margin: auto;
    top: 0px;
    position: absolute;
    background-color: rgba(0,0,0,0.4);
  }

  .sk-fading-circle {
    top: 50%;
    margin: auto;
    width: 40px;
    height: 40px;
    position: relative;
  }

  .sk-fading-circle .sk-circle {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
  }

  .sk-fading-circle .sk-circle:before {
    content: '';
    display: block;
    margin: 0 auto;
    width: 15%;
    height: 15%;
    background-color: #FFF;
    border-radius: 100%;
    -webkit-animation: sk-circleFadeDelay 1.2s infinite ease-in-out both;
            animation: sk-circleFadeDelay 1.2s infinite ease-in-out both;
  }
  .sk-fading-circle .sk-circle2 {
    -webkit-transform: rotate(30deg);
        -ms-transform: rotate(30deg);
            transform: rotate(30deg);
  }
  .sk-fading-circle .sk-circle3 {
    -webkit-transform: rotate(60deg);
        -ms-transform: rotate(60deg);
            transform: rotate(60deg);
  }
  .sk-fading-circle .sk-circle4 {
    -webkit-transform: rotate(90deg);
        -ms-transform: rotate(90deg);
            transform: rotate(90deg);
  }
  .sk-fading-circle .sk-circle5 {
    -webkit-transform: rotate(120deg);
        -ms-transform: rotate(120deg);
            transform: rotate(120deg);
  }
  .sk-fading-circle .sk-circle6 {
    -webkit-transform: rotate(150deg);
        -ms-transform: rotate(150deg);
            transform: rotate(150deg);
  }
  .sk-fading-circle .sk-circle7 {
    -webkit-transform: rotate(180deg);
        -ms-transform: rotate(180deg);
            transform: rotate(180deg);
  }
  .sk-fading-circle .sk-circle8 {
    -webkit-transform: rotate(210deg);
        -ms-transform: rotate(210deg);
            transform: rotate(210deg);
  }
  .sk-fading-circle .sk-circle9 {
    -webkit-transform: rotate(240deg);
        -ms-transform: rotate(240deg);
            transform: rotate(240deg);
  }
  .sk-fading-circle .sk-circle10 {
    -webkit-transform: rotate(270deg);
        -ms-transform: rotate(270deg);
            transform: rotate(270deg);
  }
  .sk-fading-circle .sk-circle11 {
    -webkit-transform: rotate(300deg);
        -ms-transform: rotate(300deg);
            transform: rotate(300deg);
  }
  .sk-fading-circle .sk-circle12 {
    -webkit-transform: rotate(330deg);
        -ms-transform: rotate(330deg);
            transform: rotate(330deg);
  }
  .sk-fading-circle .sk-circle2:before {
    -webkit-animation-delay: -1.1s;
            animation-delay: -1.1s;
  }
  .sk-fading-circle .sk-circle3:before {
    -webkit-animation-delay: -1s;
            animation-delay: -1s;
  }
  .sk-fading-circle .sk-circle4:before {
    -webkit-animation-delay: -0.9s;
            animation-delay: -0.9s;
  }
  .sk-fading-circle .sk-circle5:before {
    -webkit-animation-delay: -0.8s;
            animation-delay: -0.8s;
  }
  .sk-fading-circle .sk-circle6:before {
    -webkit-animation-delay: -0.7s;
            animation-delay: -0.7s;
  }
  .sk-fading-circle .sk-circle7:before {
    -webkit-animation-delay: -0.6s;
            animation-delay: -0.6s;
  }
  .sk-fading-circle .sk-circle8:before {
    -webkit-animation-delay: -0.5s;
            animation-delay: -0.5s;
  }
  .sk-fading-circle .sk-circle9:before {
    -webkit-animation-delay: -0.4s;
            animation-delay: -0.4s;
  }
  .sk-fading-circle .sk-circle10:before {
    -webkit-animation-delay: -0.3s;
            animation-delay: -0.3s;
  }
  .sk-fading-circle .sk-circle11:before {
    -webkit-animation-delay: -0.2s;
            animation-delay: -0.2s;
  }
  .sk-fading-circle .sk-circle12:before {
    -webkit-animation-delay: -0.1s;
            animation-delay: -0.1s;
  }

  @-webkit-keyframes sk-circleFadeDelay {
    0%, 39%, 100% { opacity: 0; }
    40% { opacity: 1; }
  }

  @keyframes sk-circleFadeDelay {
    0%, 39%, 100% { opacity: 0; }
    40% { opacity: 1; }
  }`;

    var sonar = {
        service: {
            constants: {
                sonarDashboard: sonarHost + 'dashboard?id=',
                sonarAPIHost: sonarHost + 'api/measures/',
                sonarMetricKeys:
                    'component?metricKeys=alert_status,bugs,new_bugs,vulnerabilities,new_vulnerabilities,code_smells,new_code_smells,coverage,new_coverage,duplicated_lines_density,new_duplicated_lines_density,duplicated_blocks&componentKey=',
                sonarCoverageParam:
                    'component_tree?metricSortFilter=withMeasuresOnly&asc=true&ps=100&metricSort=coverage&s=metric&metricKeys=coverage&strategy=leaves&baseComponentKey=',
                trStr1:
                    '<tr> <td>Status</td> <td>Coverage</td> <td>New Coverage</td> <td>Duplicated Blocks</td> <td>Bugs</td> <td>New Bugs</td> </tr>',
                trStr2:
                    '<tr> <td>Code Smells</td> <td>New Code Smells</td> <td>Vulnerabilities</td> <td>New Vulnerabilities</td> <td>Duplications</td> <td>New Duplications</td> </tr>'
            },
            getDashboardUrl: function (project) {
                return sonar.service.constants.sonarDashboard + projects[project].fullName;
            },
            getAPIUrl: function (project) {
                return (
                    sonar.service.constants.sonarAPIHost +
                    sonar.service.constants.sonarMetricKeys +
                    projects[project].fullName
                );
            },
            getCoverageAPIUrl: function (project) {
                return (
                    sonar.service.constants.sonarAPIHost +
                    sonar.service.constants.sonarCoverageParam +
                    projects[project].fullName
                );
            },
            getCoverageData: async function (project) {
                let coverageUrl = sonar.service.getCoverageAPIUrl(project);
                const coverageResp = await doGet(coverageUrl, docPage.constants.headers);
                let coverageData = [];
                if (isJSON(coverageResp)) {
                    const components = JSON.parse(coverageResp).components;
                    for (let i = 0; i < components.length; i++) {
                        const measures = components[i].measures;
                        const name = components[i].name;
                        for (let j = 0; j < measures.length; j++) {
                            let metric = measures[j].metric;
                            let value = measures[j].value;
                            if ('coverage' == metric && value < 80) {
                                let temp = { name: name, value: value };
                                coverageData.push(temp);
                                break;
                            }
                        }
                    }
                }
                return coverageData;
            },

            getCoverageTable: async function (project) {
                let tableEle = $('<table class="coverageTable hoverTable"></table');
                let coverageData = await sonar.service.getCoverageData(project);
                console.debug('Coverage Data of ' + project + ': ');
                console.debug(coverageData);
                let tHead = $(
                    '<thead><tr><td>NO.</td><td>Class</td><td>Coverage</td></tr></thead>'
                );
                tableEle.append(tHead);
                let tBody = $('<tbody></tbody>');
                for (let i = 0; i < coverageData.length; i++) {
                    let index = i + 1;
                    let trEle = $(
                        '<tr><td>' +
                            index +
                            '</td><td>' +
                            coverageData[i].name +
                            '</td><td>' +
                            coverageData[i].value +
                            '%</td></tr>'
                    );
                    tBody.append(trEle);
                }
                tableEle.append(tBody);
                return tableEle;
            },

            /**
             * Generate the expected data from the response data.
             * @param {String} data response data.
             */
            getSonarData: function (data) {
                return new Promise((resolve, reject) => {
                    let expData = {};
                    const dataArr = JSON.parse(data).component.measures;
                    for (let i = 0; i < dataArr.length; i++) {
                        const name = dataArr[i].metric;
                        switch (name) {
                            case 'alert_status':
                                expData.valStatus = dataArr[i].value;
                                break;
                            case 'coverage':
                                expData.valCoverage = dataArr[i].value;
                                break;
                            case 'new_coverage':
                                expData.valNewCoverage = dataArr[i].periods[0].value;
                                break;
                            case 'duplicated_blocks':
                                expData.valDupBlocks = dataArr[i].value;
                                break;
                            case 'code_smells':
                                expData.valCodeSmells = dataArr[i].value;
                                break;
                            case 'new_code_smells':
                                expData.valNewCodeSmells = dataArr[i].periods[0].value;
                                break;
                            case 'bugs':
                                expData.valBugs = dataArr[i].value;
                                break;
                            case 'new_bugs':
                                expData.valNewBugs = dataArr[i].periods[0].value;
                                break;
                            case 'vulnerabilities':
                                expData.valVulner = dataArr[i].value;
                                break;
                            case 'new_vulnerabilities':
                                expData.valNewVulner = dataArr[i].periods[0].value;
                                break;
                            case 'duplicated_lines_density':
                                expData.valDuplicated = dataArr[i].value;
                                break;
                            case 'new_duplicated_lines_density':
                                expData.valNewDuplicated = dataArr[i].periods[0].value;
                                break;
                            default:
                                break;
                        }
                    }
                    resolve(expData);
                });
            },

            getSonarTable: function (project, data) {
                let sonarTable = $('<table class="sonar ' + project + '"></table>');

                let trValStr1 = $('<tr></tr>');
                trValStr1.append(sonar.service.verifyStatus(data.valStatus));
                trValStr1.append(sonar.service.verifyCoverage(data.valCoverage, project));
                trValStr1.append(sonar.service.verifyNewCoverage(data.valNewCoverage));
                trValStr1.append(sonar.service.verifyOther(data.valDupBlocks));
                trValStr1.append(sonar.service.verifyOther(data.valBugs));
                trValStr1.append(sonar.service.verifyOther(data.valNewBugs));

                let trValStr2 = $('<tr></tr>');
                trValStr2.append(sonar.service.verifyOther(data.valCodeSmells));
                trValStr2.append(sonar.service.verifyOther(data.valNewCodeSmells));
                trValStr2.append(sonar.service.verifyOther(data.valVulner));
                trValStr2.append(sonar.service.verifyOther(data.valNewVulner));
                trValStr2.append(sonar.service.verifyOther(data.valDuplicated));
                trValStr2.append(sonar.service.verifyOther(data.valNewDuplicated));

                sonarTable.append($(sonar.service.constants.trStr1));
                sonarTable.append(trValStr1);
                sonarTable.append($(sonar.service.constants.trStr2));
                sonarTable.append(trValStr2);
                return sonarTable;
            },

            /**
             * Verify status and return the td string.
             * @param {String} status status value.
             */
            verifyStatus: function (status) {
                if ('WARN' == status) {
                    return $(
                        '<td style="font-weight: bold; color: white; background-color: #ed7d21;">' +
                            status +
                            '</td>'
                    );
                } else if ('OK' == status) {
                    return $(
                        '<td style="font-weight: bold; color: white; background-color: #01aa01;">' +
                            status +
                            '</td>'
                    );
                } else {
                    return $(
                        '<td style="font-weight: bold; color: white; background-color: #d43541;">' +
                            status +
                            '</td>'
                    );
                }
            },
            /**
             * Verify coverage and return the td object.
             * @param {Number} num coverage.
             * @param {String} project project name.
             */
            verifyCoverage: function (num, project) {
                num = tools.formatNumber(num);
                if (num == undefined) {
                    return $('<td>-</td>');
                } else if (80 > new Number(num)) {
                    const coverage = new Number(num);
                    let tdEle = $('<td style="font-weight: bold; color: red;"></td>');
                    if (coverage > 0) {
                        let divEle = $('<div class="coverage detailFather"></div>');
                        let spanEle = $('<span>' + coverage + '</span>');
                        let iEle = $(docPage.constants.infoIcon);
                        spanEle.append(iEle);
                        divEle.append(spanEle);
                        sonar.service.getCoverageTable(project).then(data => divEle.append(data));
                        tdEle.append(divEle);
                    } else {
                        tdEle.text(coverage);
                    }
                    return tdEle;
                } else {
                    return $('<td>' + num + '</td>');
                }
            },
            verifyNewCoverage: function (num) {
                num = tools.formatNumber(num);
                if (num == undefined) {
                    return $('<td>-</td>');
                } else if (80 > new Number(num)) {
                    return $('<td style="font-weight: bold; color: red;">' + num + '</td>');
                } else {
                    return $('<td>' + num + '</td>');
                }
            },

            /**
             * Verify other number and return the td string.
             * @param {Number} num number.
             */
            verifyOther: function (num) {
                num = tools.formatNumber(num);
                if (num == undefined) {
                    return $('<td>-</td>');
                } else if (0 < new Number(num)) {
                    return $('<td style="font-weight: bold; color: red;">' + num + '</td>');
                } else {
                    return $('<td>' + num + '</td>');
                }
            }
        },
        ui: {
            constants: {
                tableHead:
                    '<tr> <td>Lines</td> <td>Files</td> <td>Methods</td> <td>Classes</td> <td>Conditionals</td></tr>'
            },
            getSonarData: function (jobHtml) {
                return new Promise((resolve, reject) => {
                    let uiSonarData = {};
                    let tempDiv = document.createElement('div');
                    tempDiv.innerHTML = jobHtml;
                    const as = tempDiv.querySelectorAll('a');
                    for (let i = 0; i < as.length; i++) {
                        if ('Cobertura Coverage Report' == as[i].text) {
                            let text = as[i].parentElement.nextElementSibling.textContent;
                            text = text.replaceAll(' ', '');
                            text = text.replaceAll(' ', '');
                            text = text.replaceAll('\n\n', '\n');
                            text = text.replaceAll(':', '');
                            text = text.replaceAll('%', '');
                            const textArr = text.split('\n');
                            for (let j = 0; j < textArr.length - 1; j++) {
                                uiSonarData[textArr[j]] = textArr[j + 1];
                                j++;
                            }
                            break;
                        }
                    }
                    resolve(uiSonarData);
                });
            },
            getSonarTable: function (project, uiSonarData) {
                let sonarTable = $('<table class="sonar ' + project + '"></table>');

                let trValStr = $('<tr></tr>');
                trValStr.append(sonar.service.verifyNewCoverage(uiSonarData['Lines']));
                trValStr.append(sonar.service.verifyNewCoverage(uiSonarData['Files']));
                trValStr.append(sonar.service.verifyNewCoverage(uiSonarData['Methods']));
                trValStr.append(sonar.service.verifyNewCoverage(uiSonarData['Classes']));
                trValStr.append(sonar.service.verifyNewCoverage(uiSonarData['Conditionals']));
                sonarTable.append($(sonar.ui.constants.tableHead));
                sonarTable.append(trValStr);
                return sonarTable;
            }
        }
    };

    var pipeline = {
        common: {
            /**
             * Generate the expected data from the response data.
             * @param {String} data response data.
             */
            getPipelineData: function (data) {
                return new Promise((resolve, reject) => {
                    let expData = {};
                    const targetData = JSON.parse(data)[0];
                    expData.job = targetData.id;
                    expData.status = targetData.status;
                    expData.startTime = dateFormat(
                        'yyyy-MM-dd HH:mm',
                        new Date(targetData.startTimeMillis)
                    );
                    if ('IN_PROGRESS' === targetData.status) {
                        expData.securityStatus = 'IN_PROGRESS';
                        expData.ppmsStatus = 'IN_PROGRESS';
                    } else {
                        const stages = targetData.stages;
                        for (let i = 0; i < stages.length; i++) {
                            const name = stages[i].name;
                            if ('Security' == name) {
                                const status = stages[i].status;
                                expData.securityStatus = status;
                                if ('FAILED' === status) {
                                    expData.securityErrMsg = stages[i].error.message;
                                }
                            }
                            if ('IPScan and PPMS' == name) {
                                const status = stages[i].status;
                                expData.ppmsStatus = status;
                                if ('FAILED' === status) {
                                    expData.ppmsErrMsg = stages[i].error.message;
                                }
                            }
                        }
                    }
                    resolve(expData);
                });
            },
            getSecurityPipelineUrl: function (project) {
                return baseUrl + project;
            },
            getSecurityPipelineJobUrl: function (project, job) {
                return baseUrl + project + '/' + job;
            },
            getConsoleUrl: function (project, job) {
                return baseUrl + project + '/' + job + '/consoleText';
            },
            getBlueOceanUrl: function (project, job) {
                return (
                    jenkinsHost +
                    'blue/organizations/jenkins/SelfBilling-Security%2F' +
                    project +
                    '/detail/' +
                    project +
                    '/' +
                    job
                );
            }
        },
        service: {
            getAPIUrl: function (project) {
                return baseUrl + project + '/wfapi/runs?fullStages=false';
            }
        },
        ui: {
            getBuildUrl: function (project) {
                return (
                    jenkinsHost +
                    'job/SelfBilling/job/' +
                    projects[project]['fullName'] +
                    '/job/master/wfapi/runs?fullStages=false'
                );
            },
            getBuildJob: function (resp) {
                return new Promise((resolve, reject) => {
                    const targetData = JSON.parse(resp)[0];
                    const job = targetData.id;
                    resolve(job);
                });
            },
            getBuildJobUrl: function (project, job) {
                return (
                    jenkinsHost +
                    'job/SelfBilling/job/' +
                    projects[project]['fullName'] +
                    '/job/master/' +
                    job +
                    '/'
                );
            },
            createBuildPipelineButton: function (projectTitleDiv, jobUrl) {
                // Create UI Build Pipeline Button.
                let projectSubTitleCoverage = $(
                    '<a class="subtitle" target="_blank"><img src="' +
                        jenkinsIcon +
                        '" title="Coverage Build Pipeline">Coverage</a>'
                );
                projectSubTitleCoverage.attr('href', jobUrl);
                projectTitleDiv.append(projectSubTitleCoverage);
            }
        }
    };

    var fortify = {
        constants: {
            maxIssueNumber: 30,
            dashboard: 'https://fortify.tools.sap/ssc/html/ssc/dashboard/Issue%20Stats',
            summaryApi:
                'https://fortify.tools.sap/ssc/api/v1/issueaging?limit=20&orderby=-averageDaysToReview&start=0',
            pageUrl:
                'https://fortify.tools.sap/ssc/html/ssc/version/%s/fix/null/?filterSet=a243b195-1930-3f8b-1403-d55b7a7d78e6',
            detailApi:
                'https://fortify.tools.sap/ssc/api/v1/projectVersions/%s/issues?filterset=a243b195-0a59-3f8b-1403-d55b7a7d78e6&limit=%d&orderby=%2BprimaryTag&showhidden=false&showremoved=false&showshortfileNames=true&showsuppressed=false&start=0'
        },
        getHeaders: function () {
            return {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: tools.base64Encode(username, password)
            };
        },
        getPageUrl: function (project) {
            return fortify.constants.pageUrl.replace('%s', projects[project]['fortifyId']);
        },
        getDetailApi: function (project, num) {
            return fortify.constants.detailApi
                .replace('%s', projects[project]['fortifyId'])
                .replace('%d', num);
        },

        /**
         * Get Fortify status data for all projects.
         */
        getSummaryData: async function () {
            const headers = fortify.getHeaders();
            const resp = await doGet(fortify.constants.summaryApi, headers);
            let summaryData = {};
            if (isJSON(resp)) {
                const response = JSON.parse(resp);
                const data = response.data;
                for (const project in projects) {
                    summaryData[project] = {};
                    for (let j = 0; j < data.length; j++) {
                        const fortifyName = projects[project].fortifyName;
                        const isCurrentProject = data[j].name == fortifyName;
                        if (isCurrentProject) {
                            summaryData[project]['pendding'] = data[j].issuesPendingReview;
                            summaryData[project]['issues'] = data[j].openIssues;
                            break;
                        }
                        if (j == data.length - 1 && !isCurrentProject) {
                            summaryData[project]['pendding'] = -1;
                            summaryData[project]['issues'] = -1;
                        }
                    }
                }
            }
            return summaryData;
        },
        getDetailData: async function (project, num) {
            const url = fortify.getDetailApi(project, num);
            const headers = fortify.getHeaders();
            const resp = await doGet(url, headers);
            let detailData = [];
            if (isJSON(resp)) {
                const response = JSON.parse(resp);
                const data = response.data;
                for (let i = 0; i < data.length; i++) {
                    let detail = {};
                    detail.issue = data[i].issueName;
                    detail.class = data[i].primaryLocation;
                    detail.line = data[i].lineNumber;
                    detail.priority = data[i].friority;
                    detailData.push(detail);
                }
            }
            return detailData;
        },
        getDetailTable: async function (project, num) {
            let detailData = await fortify.getDetailData(project, num);
            let tableEle = $('<table class="fortifyTable hoverTable"></table');
            console.debug('Fortify Detail Data of ' + project + ': ');
            console.debug(detailData);
            let tHead = $(
                '<thead><tr><td>NO.</td><td>Issue</td><td>Class: Line</td><td>Priority</td></tr></thead>'
            );
            tableEle.append(tHead);
            let tBody = $('<tbody></tbody>');
            for (let i = 0; i < detailData.length; i++) {
                let index = i + 1;
                let trEle = $(
                    '<tr><td>' +
                        index +
                        '</td><td>' +
                        detailData[i].issue +
                        '</td><td>' +
                        detailData[i].class +
                        ': ' +
                        detailData[i].line +
                        '</td><td>' +
                        detailData[i].priority +
                        '</td></tr>'
                );
                tBody.append(trEle);
                if (this.constants.maxIssueNumber == index) {
                    tBody.append($('<tr><td></td><td></td><td>...</td><td></td></tr>'));
                    break;
                }
            }
            tableEle.append(tBody);
            return tableEle;
        },
        getStatusSpan: function (project, summaryData) {
            const projectFortify = summaryData[project];
            let fortifyStatusSpan = '';
            if (projectFortify.pendding == -1) {
                fortifyStatusSpan = $(
                    '<span class="securityDetailStatus"><img src="' +
                        warningIcon +
                        '" title="No permission to access Fortify of ' +
                        project +
                        '. Please contact the administrator."/></span>'
                );
            } else if (projectFortify.issues != 0) {
                fortifyStatusSpan = $(
                    '<span class="securityDetailStatus detailFather">(<span class="fortifyFail">' +
                        projectFortify.pendding +
                        '</span>/' +
                        projectFortify.issues +
                        ')</span>'
                );
                if (projectFortify.pendding != 0) {
                    fortifyStatusSpan.children('.fortifyFail').css('color', 'red');
                    fortifyStatusSpan.children('.fortifyFail').css('font-weight', 'bold');
                    fortifyStatusSpan.append($(docPage.constants.infoIcon));
                    fortify
                        .getDetailTable(project, projectFortify.pendding)
                        .then(data => fortifyStatusSpan.append(data));
                }
            }

            return fortifyStatusSpan;
        }
    };

    var whiteSource = {
        getHtmlPath: function (project, job) {
            return (
                jenkinsHost +
                'job/SelfBilling-Security/job/' +
                project +
                '/' +
                job +
                '/artifact/piper_whitesource_vulnerability_report.html'
            );
        },
        getJsonPath: function (project, job) {
            return (
                jenkinsHost +
                'job/SelfBilling-Security/job/' +
                project +
                '/' +
                job +
                '/artifact/piper_whitesource_vulnerability_report.json'
            );
        },
        getDetailData: async function (project, job) {
            const filePath = whiteSource.getJsonPath(project, job);
            const jsonData = await doGet(filePath, docPage.constants.headers);
            let detailData = [];
            if (isJSON(jsonData)) {
                const data = JSON.parse(jsonData);
                for (let i = 0; i < data.length; i++) {
                    let eachData = {};
                    eachData.artifactId = data[i]['library']['artifactId'];
                    eachData.groupId = data[i]['library']['groupId'];
                    eachData.version = data[i]['library']['version'];
                    eachData.score = data[i]['vulnerability']['cvss3_score'];
                    detailData.push(eachData);
                }
                detailData.sort(function (a, b) {
                    return b.score - a.score;
                });
            }
            return detailData;
        },
        getDetailTable: async function (project, job) {
            let detailData = await whiteSource.getDetailData(project, job);
            let tableEle = $('<table class="whiteSourceTable hoverTable"></table');
            console.debug('WhiteSource Detail Data of ' + project + ': ');
            console.debug(detailData);
            let tHead = $(
                '<thead><tr><td>NO.</td><td>Artifact Id</td><td>Group Id</td><td>Version</td><td>Score</td></tr></thead>'
            );
            tableEle.append(tHead);
            let tBody = $('<tbody></tbody>');
            for (let i = 0; i < detailData.length; i++) {
                let index = i + 1;
                let trEle = $(
                    '<tr><td>' +
                        index +
                        '</td><td>' +
                        detailData[i].artifactId +
                        '</td><td>' +
                        detailData[i].groupId +
                        '</td><td>' +
                        detailData[i].version +
                        '</td><td>' +
                        detailData[i].score +
                        '</td></tr>'
                );
                if (detailData[i].score >= 7) {
                    trEle.addClass('wsFail');
                }
                tBody.append(trEle);
            }
            tableEle.append(tBody);
            return tableEle;
        }
    };

    var ppms = {
        getHtmlPath: function (project, job) {
            return (
                jenkinsHost +
                'job/SelfBilling-Security/job/' +
                project +
                '/' +
                job +
                '/artifact/piper_whitesource_ppms_report.html'
            );
        },
        getJsonPath: function (project, job) {
            return (
                jenkinsHost +
                'job/SelfBilling-Security/job/' +
                project +
                '/' +
                job +
                '/artifact/piper_whitesource_ppms_report.json'
            );
        },
        getDetailData: async function (project, job) {
            const filePath = ppms.getJsonPath(project, job);
            const jsonData = await doGet(filePath, docPage.constants.headers);
            let detailData = [];
            if (isJSON(jsonData)) {
                const data = JSON.parse(jsonData);
                for (let i = 0; i < data.length; i++) {
                    let eachData = {};
                    eachData.artifactId = data[i]['library']['artifactId'];
                    eachData.groupId = data[i]['library']['groupId'];
                    eachData.version = data[i]['library']['version'];

                    // Comprised.
                    const comprised = data[i]['actualFoss'] != null;
                    eachData.comprised = comprised;

                    // FOSS.
                    const model = data[i]['fossMapping']['residualRiskRatingIdModelE'];
                    if (comprised && 'GREEN' == model) {
                        continue;
                    }
                    let rating = comprised ? model : 'Unknown';
                    if ('GREY' == rating) {
                        rating = 'Not yet rated';
                    } else if ('YELLOW' == rating) {
                        rating = 'Medium Risk';
                    }
                    eachData.rating = rating;
                    detailData.push(eachData);
                }
                detailData.sort(function (a, b) {
                    return a.comprised - b.comprised;
                });
            }
            return detailData;
        },
        getDetailTable: async function (project, job) {
            let detailData = await ppms.getDetailData(project, job);
            let tableEle = $('<table class="ppmsTable hoverTable"></table');
            console.debug('PPMS Detail Data of ' + project + ': ');
            console.debug(detailData);
            let tHead = $(
                '<thead><tr><td>NO.</td><td>Artifact Id</td><td>Group Id</td><td>Version</td><td>Comprised</td><td>Rating</td></tr></thead>'
            );
            tableEle.append(tHead);
            let tBody = $('<tbody></tbody>');
            for (let i = 0; i < detailData.length; i++) {
                let index = i + 1;
                let trEle = $(
                    '<tr><td>' +
                        index +
                        '</td><td>' +
                        detailData[i].artifactId +
                        '</td><td>' +
                        detailData[i].groupId +
                        '</td><td>' +
                        detailData[i].version +
                        '</td><td>' +
                        detailData[i].comprised +
                        '</td><td>' +
                        detailData[i].rating +
                        '</td></tr>'
                );
                if ('Unknown' == detailData[i].rating) {
                    trEle.addClass('ppmsRed');
                } else if ('Not yet rated' == detailData[i].rating) {
                    trEle.addClass('ppmsGrey');
                } else if ('Medium Risk' == detailData[i].rating) {
                    trEle.addClass('ppmsYellow');
                }
                tBody.append(trEle);
            }
            tableEle.append(tBody);
            return tableEle;
        }
    };

    var tools = {
        /**
         * snapshot table and download the image.
         */
        snapshot: function () {
            let leftWidth = document.getElementsByClassName('project')[0].getBoundingClientRect()
                .left;
            leftWidth = leftWidth > 10 ? leftWidth - 10 : leftWidth;
            const bodyWidth = document.getElementsByClassName('projects')[0].offsetWidth + 40;
            html2canvas(document.body, { width: bodyWidth, x: leftWidth }).then(function (canvas) {
                var imgUrl = canvas.toDataURL();
                let descriptor =
                    'SecurityDashboard_' + tools.dateFormat('YYYYmmdd_HHMMSS', new Date());
                let imgDownLoad = document.createElement('a');
                imgDownLoad.setAttribute('href', imgUrl);
                imgDownLoad.setAttribute('download', descriptor + '.png');
                imgDownLoad.style.display = 'none';

                document.body.appendChild(imgDownLoad);
                imgDownLoad.click();
                document.body.removeChild(imgDownLoad);
            });
        },
        /**
         * Format date
         * @param fmt format standard.
         * @param date date.
         * @returns {Time formatted string}
         */
        dateFormat: function (fmt, date) {
            let ret;
            let opt = {
                'Y+': date.getFullYear().toString(),
                'm+': (date.getMonth() + 1).toString(),
                'd+': date.getDate().toString(),
                'H+': date.getHours().toString(),
                'M+': date.getMinutes().toString(),
                'S+': date.getSeconds().toString()
            };
            for (let k in opt) {
                ret = new RegExp('(' + k + ')').exec(fmt);
                if (ret) {
                    fmt = fmt.replace(
                        ret[1],
                        ret[1].length == 1 ? opt[k] : opt[k].padStart(ret[1].length, '0')
                    );
                }
            }
            return fmt;
        },
        year: new Date().getFullYear().toString(),

        /**
         * Base64 encode username and password.
         * @param {String} username username.
         * @param {String} password password.
         */
        base64Encode: function (username, password) {
            return 'Basic ' + btoa(username + ':' + password);
        },

        /**
         * Format number.
         * @param {String} str number string.
         */
        formatNumber: function (str) {
            if (str != undefined && str != null && str != '') {
                const index = String(str).indexOf('.') + 1;
                const len = String(str).length - index;
                if (len > 2) {
                    str = new Number(str).toFixed(2);
                }
            } else {
                str = undefined;
            }
            return str;
        }
    };

    var docPage = {
        constants: {
            title: GM_info.script.name,
            headHtml: '<link rel="shortcut icon" type="image/x-icon" href=' + faviconIcon + '>',
            infoIcon: '<span class="info">i</span>',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        },
        /**
         * Log the title and version at the front of the console.
         * @param {String} title title.
         * @param {String} version script version.
         */
        logInfo: function (title, version) {
            console.clear();
            const titleStyle = 'color:white;background-color:#606060';
            const versionStyle = 'color:white;background-color:#1475b2';
            const logTitle = ' ' + title + ' ';
            const logVersion = ' ' + version + ' ';
            console.log('%c' + logTitle + '%c' + logVersion, titleStyle, versionStyle);
        },
        /**
         * Update the title of page.
         */
        updateTitle: function () {
            let count = 0;
            let timerId = setInterval(() => {
                document.title = docPage.constants.title;
                count++;
                if (count > 20) {
                    clearInterval(timerId);
                }
            }, 500);
        },
        getFooter: function () {
            return $(
                '<footer><span>Copyright © 2019-' +
                    tools.year +
                    ' <a href="https://www.jianwudao.com" target="_blank">HaleShaw</a></span></footer>'
            );
        },

        /**
         * Get main title element.
         */
        getMainTitle: function () {
            let mainTitle = $('<div class="mainTitle"></div>');
            let titleImg = $('<img src=' + faviconIcon + '>');
            let titleText = $('<a>' + title + '</a>');
            let titleVersion = $('<span>v' + GM_info.script.version + '</span>');
            mainTitle.append(titleImg);
            mainTitle.append(titleText);
            mainTitle.append(titleVersion);
            return mainTitle;
        },
        getLoadingDiv: function () {
            return $(`<div class="loading">
                <div class="sk-fading-circle">
                    <div class="sk-circle1 sk-circle"></div>
                    <div class="sk-circle2 sk-circle"></div>
                    <div class="sk-circle3 sk-circle"></div>
                    <div class="sk-circle4 sk-circle"></div>
                    <div class="sk-circle5 sk-circle"></div>
                    <div class="sk-circle6 sk-circle"></div>
                    <div class="sk-circle7 sk-circle"></div>
                    <div class="sk-circle8 sk-circle"></div>
                    <div class="sk-circle9 sk-circle"></div>
                    <div class="sk-circle10 sk-circle"></div>
                    <div class="sk-circle11 sk-circle"></div>
                    <div class="sk-circle12 sk-circle"></div>
                </div>
            </div>`);
        },
        initPage: function () {
            docPage.logInfo(docPage.constants.title, GM_info.script.version);
            document.head.innerHTML += docPage.constants.headHtml;
            GM_addStyle(mainStyle);
            GM_addStyle(loadingStyle);
            document.body.innerHTML = '';
            $('body').append(docPage.getMainTitle());
            $('body').append(footer);
            $('body').append(docPage.getLoadingDiv());
            docPage.updateTitle();
        },

        getGitUrl: function (project) {
            return gitHost + projects[project].fullName;
        }
    };

    var setting = {
        /**
         * Check whether username and password are blank.
         */
        checkPassword: function () {
            username = GM_getValue('username');
            password = GM_getValue('password');
            return (
                username != null &&
                username != undefined &&
                username != '' &&
                password != null &&
                password != undefined &&
                password != ''
            );
        }
    };

    let footer = docPage.getFooter();

    docPage.initPage();
    main(false);

    function main(reload) {
        let nameExist = setting.checkPassword();
        if (!reload) {
            addSetting();
        } else if ($('.projects')) {
            $('.projects').remove();
        }
        if (nameExist) {
            initData();
        } else {
            window.alert('请先设置访问Fortify的帐号密码！');
        }
    }

    /**
     * Add the setting div.
     */
    function addSetting() {
        let settingDiv = $('<form class="setting"></form>');
        let titleSpan = $('<a><img src=' + fotifyIcon + '>Fortify</a>');
        titleSpan.attr('href', fortify.constants.dashboard);
        titleSpan.attr('target', '_blank');
        titleSpan.css('font-weight', 'bold');

        let userSpan = $('<span>User:</span>');
        let nameInput = $('<input class="username" type="text" autocomplete="on" />');
        let pwdSpan = $('<span>Password:</span>');
        let pwdInput = $('<input class="password" type="password" autocomplete="off" />');
        let saveButton = $(
            '<button id="save" type="button" title="It will refresh automatically">Save / Refresh</button>'
        );
        let snapshotButton = $('<button id="snapshot" type="button">Snapshot</button>');

        nameInput.attr('value', username);
        pwdInput.attr('value', password);

        settingDiv.append(titleSpan);
        settingDiv.append(userSpan);
        settingDiv.append(nameInput);
        settingDiv.append(pwdSpan);
        settingDiv.append(pwdInput);
        settingDiv.append(saveButton);
        settingDiv.append(snapshotButton);
        footer.before(settingDiv);

        addListener(saveButton, snapshotButton, nameInput, pwdInput);
    }

    /**
     * Add listener for elements.
     * @param {Object} saveBtn save button.
     * @param {Object} snapshotButton snapshot button.
     * @param {Object} nameInput username input.
     * @param {Object} pwdInput password input.
     */
    function addListener(saveBtn, snapshotButton, nameInput, pwdInput) {
        saveBtn.click(function () {
            save(nameInput, pwdInput);
        });

        snapshotButton.click(function () {
            tools.snapshot();
        });

        nameInput.keypress(function (e) {
            if (e.keyCode == 13) {
                save(nameInput, pwdInput);
            }
        });

        pwdInput.keypress(function (e) {
            if (e.keyCode == 13) {
                save(nameInput, pwdInput);
            }
        });
    }

    /**
     * Save username and password, and then refresh the page.
     * @param {Object} nameInput username input.
     * @param {Object} pwdInput password input.
     */
    function save(nameInput, pwdInput) {
        const name = nameInput.val();
        const pwd = pwdInput.val();
        if (name == '' || pwd == '') {
            $('.loading').hide();
            window.alert('帐号密码不能为空！');
            return;
        }
        GM_setValue('username', name);
        GM_setValue('password', pwd);

        $('.loading').show();
        main(true);
    }

    async function initData() {
        $('.loading').show();
        let projectsDiv = $('<div class="projects"></div>');
        const fortifyStatusData = await fortify.getSummaryData();
        console.debug('Fortify Status Data: ', fortifyStatusData);
        let serviceProjectDiv = $('<div class="serviceProject"></div>');
        let uiProjectDiv = $('<div class="uiProject"></div>');
        for (const project in projects) {
            let projectDiv = $('<div class="project"></div>');
            let url = pipeline.service.getAPIUrl(project);
            const headers = docPage.constants.headers;
            const pipelineData = await doGet(url, headers);

            let projectTitleDiv;
            if (isJSON(pipelineData)) {
                let expData = await pipeline.common.getPipelineData(pipelineData);
                console.debug('Pipeline Data of ' + project + ': ', expData);

                projectTitleDiv = getProjectTitleDiv(project);
                let projectStatusDiv = getProjectStatusDiv(project, expData);
                // getBlueOceanData(project, expData.job);
                let projectSecurityDiv = getProjectSecurityDiv(project, expData);
                let projectButtonDiv = getButtonDiv(project, fortifyStatusData);

                projectDiv.append(projectTitleDiv);
                projectDiv.append(projectStatusDiv);
                projectDiv.append(projectSecurityDiv);
                projectDiv.append(projectButtonDiv);
            }

            let sonarTable;
            if (projects[project]['backend']) {
                url = sonar.service.getAPIUrl(project);
                const sonarData = await doGet(url, headers);
                if (isJSON(sonarData)) {
                    let treatedData = await sonar.service.getSonarData(sonarData);
                    console.debug('Sonar Data of ' + project + ': ', treatedData);
                    sonarTable = sonar.service.getSonarTable(project, treatedData);
                }
            } else {
                url = pipeline.ui.getBuildUrl(project);
                const pipelineResp = await doGet(url, headers);
                if (isJSON(pipelineResp)) {
                    const job = await pipeline.ui.getBuildJob(pipelineResp);
                    const jobUrl = pipeline.ui.getBuildJobUrl(project, job);
                    const jobHtml = await doGet(jobUrl, headers);
                    const uiSonarData = await sonar.ui.getSonarData(jobHtml);
                    console.debug('Sonar Data of ' + project + ': ', uiSonarData);
                    sonarTable = sonar.ui.getSonarTable(project, uiSonarData);

                    // Create UI Build Pipeline Button.
                    pipeline.ui.createBuildPipelineButton(projectTitleDiv, jobUrl);
                }
            }
            projectDiv.append(sonarTable);
            if (projects[project]['backend']) {
                serviceProjectDiv.append(projectDiv);
            } else {
                uiProjectDiv.append(projectDiv);
            }
        }
        projectsDiv.append(serviceProjectDiv);
        projectsDiv.append(uiProjectDiv);

        footer.before(projectsDiv);
        $('.loading').hide();
    }

    function getProjectTitleDiv(project) {
        let projectTitleDiv = $('<div class="titleDiv"></div>');

        let projectTitle = $('<a class="title" target="_blank"></a>');
        projectTitle.attr('href', docPage.getGitUrl(project));
        projectTitle.html(project);
        projectTitleDiv.append(projectTitle);

        if (projects[project]['backend']) {
            let projectSubTitleSonar = $(
                '<a class="subtitle" target="_blank"><img src="' +
                    sonarIcon +
                    '" title="Sonar">Sonar</a>'
            );
            projectSubTitleSonar.attr('href', sonar.service.getDashboardUrl(project));
            projectTitleDiv.append(projectSubTitleSonar);
        }

        let projectSubTitlePipeline = $(
            '<a class="subtitle" target="_blank"><img src="' +
                jenkinsIcon +
                '" title="Pipeline">Pipeline</a>'
        );
        projectSubTitlePipeline.attr('href', pipeline.common.getSecurityPipelineUrl(project));
        projectTitleDiv.append(projectSubTitlePipeline);
        return projectTitleDiv;
    }

    function getProjectStatusDiv(project, data) {
        let projectStatusDiv = $('<div class="statusDiv"></div>');
        const status = data.status;
        let projectStatusTitle = $('<span class="key">Status:</span>');
        let projectStatusStatus = $('<span>' + status + '</span>');
        if ('SUCCESS' === status) {
            projectStatusStatus.attr('class', 'main status success');
        } else if ('UNSTABLE' === status) {
            projectStatusStatus.attr('class', 'main status unstable');
        } else if ('ABORTED' === status) {
            projectStatusStatus.attr('class', 'main status aborted');
        } else if ('IN_PROGRESS' === status) {
            projectStatusStatus.attr('class', 'main status progress');
        } else {
            projectStatusStatus.attr('class', 'main status failed');
        }

        let projectStatusTime = $('<span title="StartTime">' + data.startTime + '</span>');

        const job = data.job;
        let projectStatusJob = $('<a title="Job" target="_blank">' + job + '</a>');
        projectStatusJob.attr('href', pipeline.common.getSecurityPipelineJobUrl(project, job));

        let projectStatusLog = $(
            '<a target="_blank"><img src="' + consoleIcon + '" title="Console Text">Log</a>'
        );
        projectStatusLog.attr('href', pipeline.common.getConsoleUrl(project, job));

        let projectStatusOcean = $(
            '<a target="_blank"><img src="' + blueOceanIcon + '" title="Blue Ocean">BlueOcean</a>'
        );
        projectStatusOcean.attr('href', pipeline.common.getBlueOceanUrl(project, job));

        let projectStatusWhiteSource = $(
            '<a target="_blank"><img src="' +
                whitesourceIcon +
                '" title="WhiteSource">WhiteSource</a>'
        );
        projectStatusWhiteSource.attr('href', whiteSource.getHtmlPath(project, job));

        let projectStatusPPMS = $(
            '<a target="_blank"><img src="' + ppmsIcon + '" title="PPMS">PPMS</a>'
        );
        projectStatusPPMS.attr('href', ppms.getHtmlPath(project, job));

        projectStatusDiv.append(projectStatusTitle);
        projectStatusDiv.append(projectStatusStatus);
        projectStatusDiv.append(projectStatusTime);
        projectStatusDiv.append(projectStatusJob);
        projectStatusDiv.append(projectStatusLog);
        projectStatusDiv.append(projectStatusOcean);
        projectStatusDiv.append(projectStatusWhiteSource);
        projectStatusDiv.append(projectStatusPPMS);
        return projectStatusDiv;
    }

    function getProjectSecurityDiv(project, data) {
        let projectSecurityDiv = $('<div class="securityDiv"></div>');
        const securityStatus = data.securityStatus;
        let projectSecurityTitle = $('<span class="key">Security:</span>');
        let projectSecurityStatus = $('<span>' + securityStatus + '</span>');
        let projectSecurityMsgTitle = '';
        let projectSecurityMsg = '';
        if ('SUCCESS' === securityStatus) {
            projectSecurityStatus.attr('class', 'status success');
        } else if ('IN_PROGRESS' === securityStatus) {
            projectSecurityStatus.attr('class', 'status progress');
        } else if ('UNSTABLE' === securityStatus) {
            projectSecurityStatus.attr('class', 'status unstable');
        } else {
            let errMsg = getReason(data.securityErrMsg);
            projectSecurityStatus.attr('class', 'status failed');
            projectSecurityMsgTitle = $('<span class="key">Reason:</span>');
            const titleMsg = 'Unknown' == errMsg ? 'Unknown! Please check in Jenkins.' : errMsg;
            projectSecurityMsg = $(
                '<span class="msg" title="' + titleMsg + '">' + errMsg + '</span>'
            );

            // If the reason is WhiteSource, then get the detail information.
            if ('WhiteSource' == errMsg) {
                whiteSource.getDetailTable(project, data.job).then(data => {
                    if (data) {
                        const info = $(docPage.constants.infoIcon);
                        projectSecurityMsg.addClass('detailFather');
                        projectSecurityMsg.append(info);
                        projectSecurityMsg.append(data);
                    }
                });
            }
        }
        projectSecurityDiv.append(projectSecurityTitle);
        projectSecurityDiv.append(projectSecurityStatus);
        projectSecurityDiv.append(projectSecurityMsgTitle);
        projectSecurityDiv.append(projectSecurityMsg);

        if ('SUCCESS' === securityStatus) {
            let projectPPMSTitle = $('<span class="key">PPMS:</span>');
            const ppmsStatus = data.ppmsStatus;
            let projectPPMSStatus = $('<span>' + ppmsStatus + '</span>');
            if ('SUCCESS' === ppmsStatus) {
                projectPPMSStatus.attr('class', 'status success');
            } else {
                projectPPMSStatus.attr('class', 'msg');
                projectPPMSStatus.attr('title', data.ppmsErrMsg);
                const info = $(docPage.constants.infoIcon);
                projectPPMSStatus.addClass('detailFather');
                projectPPMSStatus.append(info);
                ppms.getDetailTable(project, data.job).then(data => projectPPMSStatus.append(data));
            }
            projectSecurityDiv.append(projectPPMSTitle);
            projectSecurityDiv.append(projectPPMSStatus);
        }
        return projectSecurityDiv;
    }

    function getButtonDiv(project, fortifyStatusData) {
        let projectButtonDiv = $('<div class="buttonDiv"></div>');

        if (projects[project]['backend']) {
            let projectButtonFortify = $(
                '<a href="' +
                    fortify.getPageUrl(project) +
                    '" target="_blank"><img src="' +
                    fotifyIcon +
                    '" title="Fortify">Fortify</a>'
            );

            let fortifyStatusSpan = fortify.getStatusSpan(project, fortifyStatusData);
            projectButtonFortify.append(fortifyStatusSpan);

            let projectButtonBlackDuck = $(
                '<a href="' +
                    projects[project]['blackDuck'] +
                    '" target="_blank"><img src="' +
                    blackDuckIcon +
                    '" title="BlackDuck">BlackDuck</a>'
            );
            projectButtonDiv.append(projectButtonFortify);
            projectButtonDiv.append(projectButtonBlackDuck);
        }

        let projectButtonWhitesource = $(
            '<a href="' +
                projects[project]['whitesource'] +
                '" target="_blank"><img src="' +
                whitesourceIcon +
                '" title="Whitesource">Whitesource</a>'
        );
        projectButtonDiv.append(projectButtonWhitesource);

        if (!projects[project]['backend']) {
            let projectButtonCheckMarx = $(
                '<a href="' +
                    projects[project]['checkmarx'] +
                    '" target="_blank"><img src="' +
                    checkMarxIcon +
                    '" title="CheckMarx">CheckMarx</a>'
            );
            projectButtonDiv.append(projectButtonCheckMarx);
        }
        return projectButtonDiv;
    }

    /**
     * call the API and return the response.
     * @param {String} url url.
     * @param {Object} headers headers.
     */
    function doGet(url, headers) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'get',
                url: url,
                headers: headers,
                onload: function (res) {
                    if (res.status === 200) {
                        resolve(res.response);
                    } else {
                        console.warn('Get ' + url + ' Failed! Status: ' + res.status);
                        console.debug(res);
                        determineRequestStatus(url, res.status);
                    }
                },
                onerror: function (err) {
                    console.error('Get ' + url + ' Failed! Status: ' + err.status);
                    console.debug(err);
                    GM_notification('Get ' + url + ' Failed!', 'Error - ' + title);
                    determineRequestStatus(url, err.status);
                }
            });
        });
    }

    /**
     * call the API and return the response.
     * @param {String} url url.
     * @param {Object} headers headers.
     */
    function doGetRedirect(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'get',
                url: url,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                onload: function (res) {
                    console.debug(res);
                },
                onerror: function (err) {
                    const errorMsg = err.error;
                    const redirectedUrl = errorMsg.split('"')[1];
                    resolve(redirectedUrl);
                }
            });
        });
    }

    /**
     * Determin the status of request.
     */
    async function determineRequestStatus(url, status) {
        if (url.indexOf('jaas-gcp.cloud.sap.corp') != -1) {
            if (status === 403) {
                const redirectUrl = await doGetRedirect(loginUrl);
                $('.loading').hide();
                window.alert('认证失败，请先登录！');
                window.open(redirectUrl, '_blank');
            }
        }
        if (url.indexOf('fortify') != -1) {
            $('.loading').hide();
            if (status === 403) {
                window.alert('帐号无Fortify权限，请联系管理员！');
            }
            if (status === 401) {
                window.alert(
                    'Fortify已启用SSO，请先登录Fortify。\n若还失败，请检查Fortify帐号密码！'
                );
                window.open(fortify.constants.dashboard, '_blank');
                $('.username').focus();
            }
        }
    }

    /**
     * Call BlueOcean API to get response.
     * @param {String} project project name.
     * @param {Number} job job number.
     */
    async function getBlueOceanData(project, job) {
        const url = getBlueOceanApi(project, job);
        const blueOceanResp = await doGet(url, docPage.constants.headers);
        let blueOceandData = {};
        if (isJSON(blueOceanResp)) {
            let data = JSON.parse(blueOceanResp);
            for (let i = 0; i < data.length; i++) {
                const displayName = data[i]['displayName'];
                if (securityStages.hasOwnProperty(displayName)) {
                    blueOceandData[securityStages[displayName]] = data[i]['result'];
                }
            }
            console.debug('BlueOcean Data of ' + project + ': ', blueOceandData);
        }
        return blueOceandData;
    }

    function getBlueOceanApi(project, job) {
        return (
            jenkinsHost +
            'blue/rest/organizations/jenkins/pipelines/SelfBilling-Security/pipelines/' +
            project +
            '/runs/' +
            job +
            '/nodes'
        );
    }

    function getReason(log) {
        if (log == '' || log == undefined || log.trim() == '') {
            return 'Unknown';
        }
        const logLower = log.toLocaleLowerCase();
        let reason = '';
        if (logLower.indexOf('whitesource') != -1) {
            reason = 'WhiteSource';
        } else if (logLower.indexOf('fortify') != -1) {
            reason = 'Fortify';
        } else if (logLower.indexOf('checkmarx') != -1) {
            reason = 'CheckMarx';
        } else if (logLower.indexOf('detect') != -1 || logLower.indexOf('blackduck') != -1) {
            reason = 'BlackDuck';
        } else {
            reason = log;
        }
        return reason;
    }

    /**
     * Check whether the string is a JSON object.
     * @param {String} str json string.
     */
    function isJSON(str) {
        try {
            JSON.parse(str);
        } catch (e) {
            console.log('Parse JSON error' + e);
            return false;
        }
        return true;
    }
})();
