// ==UserScript==
// @name     Jenkins RCPTT useful shortcuts
// @version  7
// @match https://ci.eclipse.org/*
// @match https://ci.eclipse.org/rcptt/view/active/job/master/1723/
// @grant    none
// @description Adds artifact links to the job's status page
// @namespace https://greasyfork.org/users/16718
// @license EPL-2
// @downloadURL https://update.greasyfork.org/scripts/525401/Jenkins%20RCPTT%20useful%20shortcuts.user.js
// @updateURL https://update.greasyfork.org/scripts/525401/Jenkins%20RCPTT%20useful%20shortcuts.meta.js
// ==/UserScript==

function log() {
  console.log(...arguments);
}

const buildPathPattern = new RegExp('/job/[^/]+/(?:\\d+|lastSuccessfulBuild|lastBuild|lastCompletedBuild|lastFailedBuild)/'.replaceAll('/', '\\/'), 'd');

function getBuildPath() {
  const originalPath = location.pathname;
  const match = buildPathPattern.exec(location.pathname);
  if (match) {
		return location.pathname.substring(0, match.indices[0][1]);
  }
  return null;
}

const tasks = document.evaluate('//div[@id="tasks"]', document, null, XPathResult.singleNode).iterateNext();

function createTask(label, url) {
  const element = document.createElement('a');
  tasks.appendChild(element);
  element.outerHTML = `<a href="${url}" class="task-link ">${label}</a>`;
}

async function exists(url) {
	const response = await fetch(url, { method: "HEAD" });
	console.log(`Got status for ${url} : ${response.status}`);
	return response.status == 200;
}

async function rawCreateExistingTask(label, path) {
  let urls = artifactToAbsoluteUrls(path);
  for (let url of urls) {
    if (await exists(url)) {
      createTask(label, url);
      return;
    } 
  }
}

function createExistingTask(label, path) {
	rawCreateExistingTask(label, path).catch((error) => {
    console.error(error);
  });
  rawCreateExistingTask('Mockup '+label, 'mockups/'+path).catch((error) => {
    console.error(error);
  });
}

const buildPath = getBuildPath();

function artifactToAbsoluteUrls(artifactPath) {
  // https://ci.eclipse.org/rcptt/job/Pull_requests/job/fixJobHangup/lastBuild/execution/node/15/ws/rcpttTests/target/results/
  return [new URL(buildPath + 'artifact/' + artifactPath, location),
          new URL(buildPath + 'execution/node/15/ws/' + artifactPath, location),
          new URL(buildPath + 'execution/node/14/ws/' + artifactPath, location)
         ];
}

if (buildPath && tasks) {
	log(`This is a build URL: ${buildPath}`);
  // https://ci.eclipse.org/rcptt/job/Pull_requests/job/master/34/artifact/rcpttTests/target/results/tests.html
  createExistingTask('HTML Test report', 'rcpttTests/target/results/tests.html');
  // https://ci.eclipse.org/rcptt/view/active/job/master/2275/artifact/rcpttTests/rcptt_ide/target/results/rcptt_ide.html
  createExistingTask('HTML Test report', 'rcpttTests/rcptt_ide/target/results/rcptt_ide.html');
  // https://ci.eclipse.org/rcptt/view/active/job/Pull_requests/job/exceptiFix/4/artifact/rcpttTests/target/results/tests.report
  createExistingTask('Binary Test report', 'rcpttTests/target/results/tests.report');
  createExistingTask('Binary Test report', 'rcpttTests/rcptt_ide/target/results/rcptt_ide.report');
  // https://ci.eclipse.org/rcptt/job/Pull_requests/job/PR-57/4/artifact/repository/full/target/repository/
  createExistingTask('P2 repository', 'repository/full/target/repository/');
  // https://ci.eclipse.org/rcptt/view/active/job/master/1744/execution/node/15/ws/rcpttTests/target/results/aut-console-0_console.log
  createExistingTask('AUT output', 'rcpttTests/target/results/aut-console-0_console.log');
  createExistingTask('AUT output', 'rcpttTests/rcptt_ide/target/results/aut-console-0_console.log');
  createExistingTask('Products', 'repository/full/target/products/');
}


