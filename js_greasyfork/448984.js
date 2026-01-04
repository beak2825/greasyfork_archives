// ==UserScript==
// @name         📊 razer devices sentry info
// @version      0.0.2
// @license MIT
// @namespace    synapse4
// @description  seen sentry issues num for razer devices
// @author       fucai.xie
// @match        *://sentry.io/*
// @icon         data:image/png;base64,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
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/448984/%F0%9F%93%8A%20razer%20devices%20sentry%20info.user.js
// @updateURL https://update.greasyfork.org/scripts/448984/%F0%9F%93%8A%20razer%20devices%20sentry%20info.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const pidSeperated =
    "103|108|110|120|122|124|126|1306|1308|131|1310|1313|1318|1319|132|1320|1321|133|134|138|143|145|2596|3072|3074|3076|521|542|545|550|552|554|575|577|579|590|595|599|601|602|605|606|618|624|630|633|634|92";
  //const pidSeperated = "103|108";

  const multiRequest = (tasks, limit, setProgress) => {
    return new Promise((resolve) => {
      let index = limit - 1;
      let unFinishedNum = tasks.length;
      const results = [];
      const requestNext = () => {
        const task = tasks.shift();
        unFinishedNum--;
        setProgress(unFinishedNum);
        if (typeof task !== "undefined") {
          index = index + 1;
          task(index).then(onDone).catch(onFail);
        } else if (unFinishedNum === 0) {
          resolve(results);
        }
      };

      const onDone = (res) => {
        console.log("onDone", res);
        const { i, ...data } = res;
        results[i] = data;
        requestNext();
      };

      const onFail = ({ i, ...err }) => {
        results[i] = err;
        requestNext();
      };

      setProgress(unFinishedNum);
      tasks.splice(0, limit).forEach((task, i) => {
        task(i).then(onDone).catch(onFail);
      }, {});
    });
  };

  const actions = {
    createIssue: async () => {
      if (
        /\/razer-asia-pacific-pte-ltd\/issues\/(\d+)\/(events\/\w+\/)?$/.test(
          location.pathname
        )
      ) {
        const issueId = parseInt(
          (/\/razer-asia-pacific-pte-ltd\/issues\/(\d+)\/(events\/\w+\/)?$/.exec(
            location.pathname
          ) || [])[1],
          10
        );
        const data = await fetch(`/api/0/issues/${issueId}/events/latest/`, {
          headers: {
            "content-type": "application/json"
          }
        }).then((res) => res.json());
        const { title, tags, entries } = data;
        const frames = entries[0].data.values[0].stacktrace.frames;
        const sourceFile = frames.reverse().find((file) => {
          return file.filename && /\/src\//.test(file.filename);
        });
        const { filename, context, lineNo, colNo } = sourceFile || frames[0];
        const url = tags.find(({ key }) => key === "url");
        const getSourceFileUrl = (repoName, repoType) => {
          if (sourceFile) {
            return `https://bitbucket.org/razersw/${repoName}${
              repoType === "mw" ? "_mw" : ""
            }/src/staging/${filename.replace(/^[\.\/]+/g, "")}`;
          }
          if (filename) {
            if (/^(components)\//.test(filename)) {
              return `https://bitbucket.org/razersw/${repoName}${
                repoType === "mw" ? "_mw" : ""
              }/src/staging/src/${filename.replace(/^[\.\/]+/g, "")}`;
            }
            return filename;
          }
          if (frames[0]) {
            return frames[0].absPath;
          }
          return "";
        };
        const showJiraInfo = (sourceFileUrl, content, developer) => {
          const jiraInfo = `
							[sentry-${issueId}] ${title}

							for more detail, please [view in sentry](https://sentry-test.razerdev.com/organizations/sentry/issues/${issueId}/)

							- ${sourceFileUrl} ${lineNo}:${colNo}
                            > ${title}
							${
                context.length
                  ? `\`\`\`
							${context
                .map(([line, text]) => {
                  return `${line} ${text}`;
                })
                .join("\n")}
							\`\`\``
                  : ""
              }
							${content}
							- **developer**: ${developer}

							after fix this issue, please use the latest [check-project](https://razersw.atlassian.net/wiki/spaces/ANNE/pages/2279964989/cli+tools+for+seperate+ui+and+mw) check it.
							\`\`\` shell
							npm install -g bitbucket:razersw/razer-cli-tools#staging
							check-project ./
							\`\`\`
							@${developer} please resolve this issue
						`;

          const dialog = document.createElement("app-window");
          dialog.store = { data: { id: "temp-dialog" } };
          dialog.setTitle(title);
          dialog.innerHTML = `<textarea slot="form" style="height: 420px;width: 1000px;border: 1px solid #ccc;box-sizing: border-box;width: calc(100% - 12px);margin: 5px;">${jiraInfo.replace(
            /^\s+/gm,
            ""
          )}</textarea>`;
          dialog.onClose = () => {
            document.body.removeChild(dialog);
          };
          document.body.appendChild(dialog);
          dialog.resize(1050);
          dialog.center();
        };
        if (
          url &&
          /\/synapse\/products\/(\d+)\/(ui|mw)\/index.html$/.test(url.value)
        ) {
          console.log(data, url.value, filename, lineNo, sourceFile, context);
          const [, pid, type] =
            /\/synapse\/products\/(\d+)\/(ui|mw)\/index.html/.exec(url.value) ||
            [];
          if (pid && type) {
            const device = devices[pid];
            const sourceFileUrl = getSourceFileUrl(device.gitUrl, type);
            showJiraInfo(
              sourceFileUrl,
              `- **device**: ${device.name.replace(/^\*+/g, "")}(pid: ${
                device.pid
              }) [ui sentry issues](https://sentry-test.razerdev.com/organizations/sentry/issues/?project=3&query=is%3Aunresolved++url%3A%22https%3A%2F%2Fapps-staging.razer.com%2Fsynapse%2Fproducts%2F${
                device.pid
              }%2Fui%2Findex.html%22&statsPeriod=14d) | [mw sentry issues](https://sentry-test.razerdev.com/organizations/sentry/issues/?project=5&query=is%3Aunresolved++url%3A%22https%3A%2F%2Fapps-staging.razer.com%2Fsynapse%2Fproducts%2F${
                device.pid
              }%2Fmw%2Findex.html%22&statsPeriod=14d)`,
              device.developer
            );
          }
        } else if (/\/synapse\/(\w+)\/(index.html)?$/.test(url.value)) {
          // https://bitbucket.org/razersw/razer-macro/src
          const [path, name] =
            url.value.match(/\/synapse\/(\w+)\/(?:index.html)?$/) || [];
          if (name) {
            const gitInfo = {
              macro: {
                repo: "razer-macro",
                developer: "Khanh Tra",
                type: "ui"
              },
              otfm: { repo: "razer-otfm", developer: "Khanh Tra", type: "mw" }
            }[name];
            if (gitInfo) {
              // https://bitbucket.org/razersw/razer-macro/commits/
              const sourceFileUrl = getSourceFileUrl(
                gitInfo.repo,
                gitInfo.type
              );
              showJiraInfo(
                sourceFileUrl,
                `- **project**: ${
                  gitInfo.repo
                } [sentry issues](https://sentry-test.razerdev.com/organizations/sentry/issues/?project=3&query=is%3Aunresolved++url%3A%22${encodeURIComponent(
                  url.value
                )}%22&statsPeriod=14d)`,
                gitInfo.developer
              );
            } else {
              console.error(`doesn't know the git repo name of ${name}`);
            }
          } else {
            console.warn(`can't extract module(${name}) in ${url.value}`);
          }
        } else {
          console.warn("invalid url", url, data, tags);
        }
      } else {
        console.warn("invalid pathname", location.pathname);
      }
    },
    showStats: async () => {
      const pidReg = new RegExp("^" + pidSeperated + "$");
      const reqList = [];
      const projectId = {
        staging_mw: 6575564,
        staging_ui: 6575582,
        prod_mw: 6575607,
        prod_ui: 6575608
      };
      const render = (list) => {
        const tbody = list
          .map((item) => {
            const { device, data, side, branch } = item;
            const pid = device.pid.split(/\D+/).shift();
            const url = `https://apps${
              branch === "prod" ? "" : "-staging"
            }.razer.com/synapse/products/${pid}/${side}/index.html`;
            const sentryUrl = `https://sentry.io/organizations/razer-asia-pacific-pte-ltd/issues/?project=${
              projectId[`${branch}_${side}`]
            }&query=is%3Aunresolved%20url%3A%22${encodeURIComponent(url)}%22`;
            const git = `${device.gitUrl}${side === "mw" ? "_mw" : ""}`;
            return `<tr>
		<td>${device.pid}</td>
		<td><a href="https://bitbucket.org/razersw/${git}/src/staging/src/" target="_blank">${git}</a></td>
		<td>${side}</td>
		<td>${branch}</td>
		<td><a href="${sentryUrl}" target="_blank">${device.name || "unknown"}</a></td>
		<td>${data.length}</td>
		<td>${device.developer}</td>
		</tr>`;
          })
          .join("\n");

        const table = `<div slot="form" contentedit="true"><table border="1">
		        <thead>
		            <tr>
		            <th>pid</th>
		            <th>git</th>
		            <th>name</th>
		            <th>side</th>
		            <th>env</th>
		            <th>issues</th>
		            <th>developer</th>
		            </tr>
		        </thead>
		        <tbody>
		        ${tbody}
		        </tbody>
		    </table></div><style>
		    table{box-sizing: border-box;width: calc(100% - 12px);margin: 5px;}
		    table th,table td{padding:7px;border-color:#ccc;}</style>`;

        return table;
      };
      Object.keys(devices).forEach((pid) => {
        if (pidReg.test(pid)) {
          ["ui", "mw"].forEach((side) => {
            const path = `/synapse/products/${pid}/${side}/index.html`;
            const url = {
              staging: `https://apps-staging.razer.com${path}`,
              prod: `https://apps.razer.com${path}`
            };
            ["staging", "prod"].forEach((branch) => {
              const req = async (i) => {
                const r = { i, side, branch, device: devices[pid] };

                try {
                  const res = await fetch(
                    `/api/0/organizations/razer-asia-pacific-pte-ltd/issues/?collapse=stats&expand=owners&expand=inbox&limit=25&project=${
                      projectId[`${branch}_${side}`]
                    }&query=url%3A%22${
                      url[branch]
                    }%22&shortIdLookup=1&statsPeriod=14d`,
                    {
                      method: "GET",
                      mode: "cors",
                      credentials: "include"
                    }
                  ).catch((err) => {
                    r.err = err;
                    return false;
                  });
                  if (res) {
                    r.data = await res.json();
                  }
                } catch (err) {
                  r.err = err;
                }
                return r;
              };
              reqList.push(req);
            });
          });
        }
      });
      const dialog = document.createElement("app-window");
      dialog.setAttribute("style", "width:1050px;");
      dialog.store = { data: { id: "temp-dialog" } };
      dialog.setTitle("📊 stats sentry issues for devices");
      dialog.innerHTML =
        '<div slot="form" style="text-align: center;padding: 100px 0;">正在请求</div>';
      dialog.onClose = () => {
        document.body.removeChild(dialog);
      };
      document.body.appendChild(dialog);

      const n = reqList.length;
      multiRequest(reqList, 30, (m) => {
        dialog.innerHTML = `<div slot="form" class="app-window-loading" style="text-align: center;padding: 100px 0;">正在请求${
          n - m
        }/${n}</div>`;
      })
        .then((done) => {
          dialog.resize(1050);
          dialog.innerHTML = render(done);
          dialog.center();
        })
        .catch((err) => {
          console.log("failed", err);
        });
    }
  };


  ['/send2reader/dialog.js','/rz-anne/devices.js'].forEach((scriptUrl)=>{
    const script = document.createElement('script');
    document.head.appendChild(script);
    script.src = `https://cdn.jsdelivr.net/gh/xiefucai/Chrome@master/userscripts${scriptUrl}?_=${Date.now()/3600000|0}`;
  });
  const actionsLayer = document.createElement("div");
  actionsLayer.innerHTML = `<div>
<button data-action="createIssue" style="display: none;">🐁</button>
<button data-action="showStats">🦚</button>
</div>`;
  document.body.appendChild(actionsLayer);
  actionsLayer.setAttribute(
    "style",
    "position: fixed;bottom: 16px;right: calc(50% + 50px);z-index: 99999;"
  );
  actionsLayer.addEventListener(
    "click",
    async (e) => {
      const action = e.target.getAttribute("data-action");
      if (actions[action]) {
        await actions[action](e).catch((err) => {
          console.error(err);
        });
      }
    },
    false
  );
})();
