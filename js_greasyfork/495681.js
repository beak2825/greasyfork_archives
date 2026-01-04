// ==UserScript==
// @name        DevOps Projects Overview
// @namespace   Violentmonkey Scripts
// @match       https://dev.azure.com/*
// @grant       none
// @version     1.1.0
// @author      Der_Floh
// @description Zeigt alle Projekte für alle Organisationen
// @license     MIT
// @icon        https://www.svgrepo.com/show/448271/azure-devops.svg
// @downloadURL https://update.greasyfork.org/scripts/495681/DevOps%20Projects%20Overview.user.js
// @updateURL https://update.greasyfork.org/scripts/495681/DevOps%20Projects%20Overview.meta.js
// ==/UserScript==

// jshint esversion: 8

let windowUrl = window.location.toString();
if (windowUrl.endsWith('/'))
	windowUrl = windowUrl.slice(0, -1);
const slashCount = windowUrl.match(/\//g).length;

if (window.location.toString().endsWith('?default')) {
		return;
}

if (window.location.toString().endsWith('?projectonly')) {
	addErrorHideCss();
	convertToProjectOnly();
} else if (slashCount == 3) {
	addErrorHideCss();
	showAllProjects();
}

async function showAllProjects() {
	const navigation = await waitForElementToExistQuery(document.body, 'div[class*="top-level-navigation"][role="navigation"]');
	try {
		const showMoreButton = await waitForElementToExistQuery(navigation, 'span[class*="action-link top-navigation-item"][role="button"]');
		if (showMoreButton)
			showMoreButton.click();
	} catch { }

	const projectsContainer = await waitForElementToExistId('skip-to-main-content');
	const currentProject = await waitForElementToExistQuery(projectsContainer, 'li[class="project-card flex-row flex-grow"]');
	const container = currentProject.parentNode;
	container.classList.add('wrap-ul');
	addWrapUlCss();

	await addProjectCards(container);
}

function addWrapUlCss() {
	const css = `
		ul.wrap-ul {
			display: flex;
			flex-wrap: wrap;
			padding: 0;
			list-style-type: none;
			margin: 0;
		}

		ul.wrap-ul li,
		ul.wrap-ul iframe {
			flex: 1 1 auto;
			margin: 5px;
			box-sizing: border-box;
		}
	`;
	const style = document.createElement('style');
	style.type = 'text/css';
	style.innerHTML = css;
	document.head.appendChild(style);
}

function addErrorHideCss() {
	const css = `
		.tfs-unhandled-error {
			display: none;
		}
	`;
	const style = document.createElement('style');
	style.type = 'text/css';
	style.innerHTML = css;
	document.head.appendChild(style);
}

async function convertToProjectOnly() {
	const projectsContainer = await waitForElementToExistId('skip-to-main-content');
	const currentProject = await waitForElementToExistQuery(projectsContainer, 'li[class="project-card flex-row flex-grow"]');
	const container = currentProject.parentNode.parentNode;
	container.style.height = '100%';
	container.firstChild.style.height = '100%';
	container.firstChild.firstChild.style.height = '100%';
	container.firstChild.firstChild.firstChild.style.height = '100%';
	container.firstChild.firstChild.firstChild.firstChild.style.height = '100%';
	const projectName = currentProject.querySelector('div[class*="project-name"]').textContent;
	container.onclick = (event) => {
		event.preventDefault();
		let url = window.frameElement.src;
		const questionMarkIndex = url.indexOf('?');
    if (questionMarkIndex !== -1) {
    	url = url.substring(0, questionMarkIndex);
		}
		if (!url.endsWith("/"))
			url += "/";
		url = url + projectName;
		console.log(url);
		if (event.ctrlKey == true) {
			window.open(url, '_blank');
		} else {
			window.top.location = url;
		}
	};
	keepOnlyElementAndAncestors(container);
}

function keepOnlyElementAndAncestors(element) {
	const elementsToKeep = new Set();
	let currentElement = element;

	while (currentElement) {
		elementsToKeep.add(currentElement);
		currentElement = currentElement.parentElement;
	}

	function addDescendantsToSet(element) {
		elementsToKeep.add(element);
		Array.from(element.children).forEach(child => {
			addDescendantsToSet(child);
		});
	}
	addDescendantsToSet(element);

	const allElements = document.body.getElementsByTagName('*');
	Array.from(allElements).forEach(el => {
		if (!elementsToKeep.has(el)) {
			el.remove();
		}
	});
}

async function addProjectCards(baseNode) {
	const projectCards = [];
	await waitForElementToExistQuery(document.body, 'a[class*="host-link navigation-link"][role="option"]');
	const projects = Array.from(document.body.querySelectorAll('a[class*="host-link navigation-link"][role="option"]'));
	projects.shift();
	const sortedProjects = projects.sort((a, b) => {
		const textA = a.querySelector('span').textContent.toLowerCase();
		const textB = b.querySelector('span').textContent.toLowerCase();
		return textA.localeCompare(textB);
	});
	for (const project of sortedProjects) {
		if (project.href.startsWith('https://dev.azure.com'))
			createIFrameForProject(baseNode, project);
	}
}

function createIFrameForProject(baseNode, project) {
	const iframe = document.createElement('iframe');
	iframe.id = project.id.replace('__bolt-host-', 'project_');
	iframe.setAttribute('name', project.querySelector('span').textContent);
	iframe.src = project.href + '?projectonly';
	iframe.style.border = 'none';
	baseNode.appendChild(iframe);
}

async function waitForElementToExistId(elementId) {
	return new Promise(async (resolve) => {
		async function checkElement() {
			const element = document.getElementById(elementId);
			if (element !== null)
				resolve(element);
			else
				setTimeout(checkElement, 100);
		}
		await checkElement();
	});
}

async function waitForElementToExistQuery(baseNode, query, timeout = 3000) {
	return new Promise((resolve, reject) => {
		const startTime = Date.now();
		async function checkElement() {
			const element = baseNode.querySelector(query);
			if (element !== null) {
				resolve(element);
			} else {
				if (Date.now() - startTime > timeout) {
					reject(new Error(`Timeout: Element with query '${query}' did not appear within ${timeout}ms`));
				} else {
					setTimeout(checkElement, 100);
				}
			}
		}
		checkElement();
	});
}
