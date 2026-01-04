// ==UserScript==
// @name        Expo EAS Build Log Export
// @namespace   Violentmonkey Scripts
// @match       https://expo.dev/accounts/*/projects/*/builds/*
// @grant       GM_xmlhttpRequest
// @version     0.5
// @author      likaci
// @description Export Expo EAS build logs and rename app files by version
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/506712/Expo%20EAS%20Build%20Log%20Export.user.js
// @updateURL https://update.greasyfork.org/scripts/506712/Expo%20EAS%20Build%20Log%20Export.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const TAG = "EAS-LOG-EXPORT";
  console.log(TAG, "loaded");

  const buildId = window.location.pathname.split("/").pop();
  let installButton;

  const observer = new MutationObserver((mutations, observer) => {
    installButton = document.querySelector(
      '[data-testid="artifact-download-button"]'
    );
    if (buildId && installButton) {
      console.log(TAG, "Found build ID:", buildId);

      const getExpoSession = () => {
        try {
          const sessionCookie = document.cookie
            .split(";")
            .find((c) => c.trim().startsWith("io.expo.auth.sessionSecret="));

          if (!sessionCookie) return null;

          return decodeURIComponent(sessionCookie.split("=")[1]);
        } catch (e) {
          console.log(TAG, "Failed to parse session cookie:", e);
          return null;
        }
      };

      const session = getExpoSession();
      if (!session) {
        console.error(TAG, "No expo session found");
        return;
      }

      const graphqlQuery = {
        query: `
            query BuildById($buildId: ID!) {
              builds {
                byId(buildId: $buildId) {
                  id
                  app {
                    slug
                  }
                  platform
                  status
                  artifacts {
                    applicationArchiveUrl
                    xcodeBuildLogsUrl
                  }
                  logFiles
                  appVersion
                  appBuildVersion
                  buildProfile
                }
              }
            }
          `,
        variables: {
          buildId: buildId,
        },
      };

      fetch("https://api.expo.dev/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "expo-session": session,
        },
        body: JSON.stringify(graphqlQuery),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(TAG, "Fetched build data:", data);
          if (data?.data?.builds?.byId) {
            handleBuildData(data.data.builds.byId);
          }
        })
        .catch((error) =>
          console.error(TAG, "Error fetching build data:", error)
        );

      observer.disconnect();
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  function handleBuildData(buildData) {
    const {
      app,
      logFiles,
      artifacts,
      appVersion,
      appBuildVersion,
      buildProfile,
      platform,
    } = buildData;
    const {slug} = app;
    const {applicationArchiveUrl, xcodeBuildLogsUrl} = artifacts;
    const filePrefix = `${appVersion}-${appBuildVersion}_${buildProfile}`;

    if (!installButton) {
      console.error(TAG, "Install button not found");
    } else {
      const targetDiv = installButton.parentNode;
      // Logs
      if (logFiles?.length > 0) {
        createDownloadButton(targetDiv, "Logs", () =>
          downloadLogs(logFiles, `logs_${platform.toLowerCase()}_${filePrefix}`)
        );
      }

      // Xcode logs
      if (xcodeBuildLogsUrl) {
        createDownloadButton(targetDiv, "Xcode Logs", () =>
          downloadFile(xcodeBuildLogsUrl, `logs_xcode_${filePrefix}.log`)
        );
      }

      // App
      if (applicationArchiveUrl) {
        createDownloadButton(targetDiv, "App", () => {
          const extension = applicationArchiveUrl.split(".").pop();
          downloadFile(
            applicationArchiveUrl,
            `${slug}_${filePrefix}.${extension}`
          );
        });
      }
    }
  }

  function createDownloadButton(targetDiv, text, onclick) {
    const btn = document.createElement("button");
    btn.textContent = text;
    btn.className =
      "border-solid rounded-md font-medium h-9 px-4 text-xs bg-button-primary text-button-primary hocus:bg-button-primary-hover";
    btn.onclick = onclick;
    targetDiv.appendChild(btn);
  }

  async function downloadLogs(logFiles, filePrefix) {
    const logsByPhase = {};
    for (const logFileUrl of logFiles) {
      try {
        const response = await fetch(logFileUrl);
        const text = await response.text();
        const lines = text.split("\n");
        lines.forEach((line) => {
          try {
            const log = JSON.parse(line);
            const phase = log.phase;
            if (!logsByPhase[phase]) {
              logsByPhase[phase] = [];
            }
            logsByPhase[phase].push(`[${log.time}] ${log.msg}`);
          } catch (e) {
            console.warn(TAG, "Error parsing log line:", line, e);
          }
        });
      } catch (error) {
        console.error(TAG, "Error fetching log file:", logFileUrl, error);
      }
    }

    let formattedLogs = "";
    for (const phase in logsByPhase) {
      formattedLogs += `=== ${phase} ===\n`;
      formattedLogs += logsByPhase[phase].join("\n");
      formattedLogs += "\n\n";
    }

    downloadBlob(
      new Blob([formattedLogs], {type: "text/plain"}),
      `${filePrefix}.log`
    );
  }

  async function downloadFile(url, filename) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: "GET",
        url: url,
        responseType: "blob",
        onload: function (response) {
          resolve(response.response);
        },
        onerror: function (error) {
          reject(error);
        }
      });
    }).then(blob => {
      downloadBlob(blob, filename);
    });
  }

  function downloadBlob(blob, filename) {
    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = filename;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }

})();