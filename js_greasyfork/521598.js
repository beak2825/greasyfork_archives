// ==UserScript==
// @name         GitHub Utils
// @name:vi      Tiện ích GitHub
// @name:zh-cn   GitHub 实用工具
// @name:zh-tw   GitHub 實用工具
// @name:ru      Утилиты GitHub
// @namespace    http://tampermonkey.net/
// @version      2024.12.30.1
// @description  GitHub utilities including file icons replacement and auto-fill repo name
// @description:vi  Tiện ích GitHub bao gồm thay thế biểu tượng tệp và tự động điền tên repo
// @description:zh-cn  GitHub 实用工具，包括文件图标替换和自动填充仓库名
// @description:zh-tw  GitHub 實用工具，包括文件圖標替換和自動填充倉庫名
// @description:ru  Утилиты GitHub, включая замену иконок файлов и автозаполнение имени репозитория
// @author       Yuusei
// @match        https://github.com/*
// @icon         https://github.githubassets.com/favicon.ico
// @grant        GM_addStyle
// @require      https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js
// @run-at       document-start
// @license      GPL-3.0-only
// @compatible   chrome
// @compatible   firefox
// @compatible   edge
// @compatible   safari
// @downloadURL https://update.greasyfork.org/scripts/521598/GitHub%20Utils.user.js
// @updateURL https://update.greasyfork.org/scripts/521598/GitHub%20Utils.meta.js
// ==/UserScript==
(function ($) {
	'use strict';
	// Add custom styles
	GM_addStyle(`
      .material-icon {
          width: 20px;
          height: 20px;
          vertical-align: text-bottom;
          margin-right: 4px;
          transition: transform 0.2s ease;
      }
      .material-icon:hover {
          transform: scale(1.2);
      }
      @media (max-width: 768px) {
          .material-icon {
              width: 16px;
              height: 16px;
              margin-right: 2px;
          }
      }
  `);
	const iconMap = {
		// Development
		'.ts': 'typescript',
		'.tsx': 'react_ts',
		'.js': 'javascript',
		'.jsx': 'react',
		'.py': 'python',
		'.java': 'java',
		'.cpp': 'cpp',
		'.c': 'c',
		'.cs': 'csharp',
		'.go': 'go',
		'.rb': 'ruby',
		'.php': 'php',
		'.rs': 'rust',
		'.swift': 'swift',
		'.kt': 'kotlin',
		'.scala': 'scala',
		'.dart': 'dart',
		'.lua': 'lua',
		'.r': 'r',
		'.sh': 'console',
		'.ps1': 'powershell',
		'.bat': 'console',
		'.cmd': 'console',
		'.wasm': 'assembly',
		'.code-workspace': 'vscode',
		'.sln': 'visualstudio',
		// Web
		'.html': 'html',
		'.htm': 'html',
		'.css': 'css',
		'.scss': 'sass',
		'.sass': 'sass',
		'.less': 'less',
		'.styl': 'stylus',
		'.vue': 'vue',
		'.svelte': 'svelte',
		'.angular': 'angular',
		// Data & Config
		'.json': 'json',
		'.yml': 'yaml',
		'.yaml': 'yaml',
		'.xml': 'xml',
		'.toml': 'settings',
		'.ini': 'settings',
		'.env': 'tune',
		'.conf': 'settings',
		'.sql': 'database',
		'.db': 'database',
		'.sqlite': 'database',
		'.graphql': 'graphql',
		'.proto': 'protobuf',
		// Documentation
		'.md': 'markdown',
		'.mdx': 'markdown',
		'.txt': 'document',
		'.pdf': 'pdf',
		'.doc': 'word',
		'.docx': 'word',
		'.odt': 'document',
		'.rtf': 'document',
		// Images
		'.svg': 'svg',
		'.png': 'image',
		'.jpg': 'image',
		'.jpeg': 'image',
		'.gif': 'image',
		'.ico': 'image',
		'.webp': 'image',
		'.bmp': 'image',
		// Media
		'.mp3': 'audio',
		'.wav': 'audio',
		'.ogg': 'audio',
		'.mp4': 'video',
		'.webm': 'video',
		'.avi': 'video',
		'.mov': 'video',
		// Archives
		'.zip': 'zip',
		'.rar': 'zip',
		'.7z': 'zip',
		'.tar': 'zip',
		'.gz': 'zip',
		'.bz2': 'zip',
		// System
		'.exe': 'exe',
		'.dll': 'dll',
		'.so': 'lib',
		'.dylib': 'lib',
		'.sys': 'windows',
		'.reg': 'windows',
		// Design
		'.fig': 'figma',
		'.sketch': 'sketch',
		'.ai': 'illustrator',
		'.psd': 'photoshop',
		'.xd': 'xd',
		// 3D & Game
		'.unity': 'unity',
		'.blend': 'blender',
		'.fbx': '3d',
		'.obj': '3d',
		'.gltf': '3d',
		'.uasset': 'unreal',
		'.upk': 'unreal',
		// Mobile
		'.apk': 'android',
		'.ipa': 'apple',
		'.xcodeproj': 'xcode',
		'.pbxproj': 'xcode',
		// Container & Cloud
		Dockerfile: 'docker',
		'.dockerignore': 'docker',
		'.tf': 'terraform',
		'.tfvars': 'terraform',
		'.vagrant': 'vagrant',
		'.helm': 'kubernetes',
	};
	const specialFiles = {
		// Package managers
		'package.json': 'nodejs',
		'package-lock.json': 'nodejs',
		'yarn.lock': 'yarn',
		'pnpm-lock.yaml': 'pnpm',
		'bun.lockb': 'bun',
		'composer.json': 'composer',
		'composer.lock': 'composer',
		Gemfile: 'ruby',
		'Gemfile.lock': 'ruby',
		'requirements.txt': 'python',
		'poetry.lock': 'python',
		'Cargo.toml': 'rust',
		'Cargo.lock': 'rust',
		// Config files
		'tsconfig.json': 'typescript',
		'.eslintrc': 'eslint',
		'.prettierrc': 'prettier',
		'.editorconfig': 'editorconfig',
		'webpack.config.js': 'webpack',
		'vite.config.js': 'vite',
		'rollup.config.js': 'rollup',
		'babel.config.js': 'babel',
		'jest.config.js': 'jest',
		'karma.conf.js': 'karma',
		'cypress.config.js': 'cypress',
		'playwright.config.js': 'playwright',
		// Documentation
		'README.md': 'markdown',
		LICENSE: 'certificate',
		'CHANGELOG.md': 'markdown',
		'CONTRIBUTING.md': 'markdown',
		// Git
		'.gitignore': 'git',
		'.gitattributes': 'git',
		'.gitmodules': 'git',
		'.gitmessage': 'git',
		'.gitkeep': 'git',
		// CI/CD
		'.travis.yml': 'travis',
		'.gitlab-ci.yml': 'gitlab',
		Jenkinsfile: 'jenkins',
		'azure-pipelines.yml': 'azure',
		'bitbucket-pipelines.yml': 'bitbucket',
		// Docker
		Dockerfile: 'docker',
		'docker-compose.yml': 'docker',
		'docker-compose.yaml': 'docker',
		'docker-compose.override.yml': 'docker',
		// Framework configs
		'angular.json': 'angular',
		'next.config.js': 'next',
		'nuxt.config.js': 'nuxt',
		'svelte.config.js': 'svelte',
		'capacitor.config.json': 'capacitor',
		'ionic.config.json': 'ionic',
		// Build tools
		Makefile: 'makefile',
		'CMakeLists.txt': 'cmake',
		'build.gradle': 'gradle',
		'pom.xml': 'maven',
		'build.sbt': 'sbt',
		// Environment
		'.env': 'tune',
		'.env.local': 'tune',
		'.env.development': 'tune',
		'.env.production': 'tune',
		'.env.test': 'tune',
		// Version managers
		'.nvmrc': 'nodejs',
		'.node-version': 'nodejs',
		'.ruby-version': 'ruby',
		'.python-version': 'python',
		'.java-version': 'java',
	};
	function replaceIcons() {
		$('.react-directory-row-name-cell-large-screen, .react-directory-row-name-cell-small-screen').each(function () {
			const $filenameElement = $(this).find('.react-directory-filename-cell');
			if ($filenameElement.length) {
				const filename = $filenameElement.text();
				let iconName = specialFiles[filename];
				if (!iconName) {
					const extension = Object.keys(iconMap).find(ext => filename.toLowerCase().endsWith(ext));
					iconName = extension ? iconMap[extension] : null;
				}
				if (iconName) {
					const $oldSvg = $(this).find('svg');
					if ($oldSvg.length) {
						const $newIcon = $('<img>', {
							src: `https://raw.githubusercontent.com/material-extensions/vscode-material-icon-theme/refs/heads/main/icons/${iconName}.svg`,
							class: 'material-icon',
							alt: iconName,
						});
						$oldSvg.replaceWith($newIcon);
					}
				}
			}
		});
	}
	// Auto fill repo name functionality
	function setupAutoFill() {
		const observer = new MutationObserver(mutations => {
			mutations.forEach(mutation => {
				if (mutation.addedNodes.length) {
					const dialog = document.querySelector('#repo-delete-menu-dialog');
					if (dialog) {
						const repoName = document.querySelector('.text-bold.f3.mt-2')?.textContent.trim();
						if (repoName) {
							const input = document.querySelector('#verification_field');
							if (input) {
								input.value = repoName;
								input.dispatchEvent(
									new Event('input', {
										bubbles: true,
										cancelable: true,
									})
								);
							}

							const deleteBtn = document.querySelector('#repo-delete-proceed-button');
							if (deleteBtn) {
								deleteBtn.disabled = false;
							}
						}
					}
				}
			});
		});

		observer.observe(document.body, {
			childList: true,
			subtree: true,
		});
	}
	// Initial setup
	$(document).ready(() => {
		replaceIcons();
		setupAutoFill();
	});
	// Watch for DOM changes for icon replacement
	const iconObserver = new MutationObserver(replaceIcons);
	iconObserver.observe(document.body, {
		childList: true,
		subtree: true,
	});
})(jQuery);
