// ==UserScript==
// @name        Github repos stats
// @namespace   Violentmonkey Scripts
// @description Load some stats for repo list, and display star counts for GitHub repositories.  Please config github token first.
// @thank https://github.com/sir-kokabi/github-sorter
// @match https://github.com/*
// @version     1.2

// @grant       GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant      GM_listValues
//
// @require https://cdn.jsdelivr.net/npm/@violentmonkey/shortcut@1
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/508793/Github%20repos%20stats.user.js
// @updateURL https://update.greasyfork.org/scripts/508793/Github%20repos%20stats.meta.js
// ==/UserScript==

	// 设置缓存过期时间为 10天 ：  1 小时（3600000 毫秒）*24*10
const CACHE_EXPIRATION = 3600000 * 24 * 10;




	function myFetch(url, options = {})
	{
		return new Promise((resolve, reject) =>
		{
			GM_xmlhttpRequest(
			{
				method: options.method || 'GET',
				url: url,
				headers: options.headers,
				onload: function (response)
				{
					resolve(
					{
						status: response.status,
						json: () => JSON.parse(response.responseText)
					});
				},
				onerror: reject
			});
		});
	}



(async function main()
{
	'use strict';


	// 注册菜单命令
	GM_registerMenuCommand("Do Work: Query and Show Stats", showStats);

  const currentPageRepo = (function extractRepoFromGitHubUrl(url) {
    // 1. 检查 URL 是否是 GitHub 链接
    if (!url.includes('github.com')) {
      return null;
    }

    // 2. 使用正则表达式提取 repo 名
    const match = url.match(/github\.com\/([^/]+)\/([^/#?]+)/);
    if (match) {
      return  match[1] +'/'+   match[2]
    }

    return null;
  })(location.href);



	function showStats()
	{
		const githubToken = GM_getValue("githubToken", "");
		if (!githubToken)
		{
			console.warn("GitHub token not set. Please set it in the script settings.");
			return;
		}



		const url = window.location.href;
		const selector = getSelector(url);

		if (!selector) return;


		inject(selector, githubToken);

	} // end showStats


const Tools = {

  // Promise.all 运行太多的 promises? 分批运行，第一批都成功，才运行下一批
  // https://gist.github.com/scil/15d63220521808ba7839f423e4d8a784
    runPromisesInBatches:async function(promises, batchSize = 50,startIndex = 0) {

    let results = [];
    let errorIndex=null;

    while (startIndex < promises.length) {
      const batch = promises.slice(startIndex, startIndex + batchSize);
      try {
        const batchResults = await Promise.all(batch);
        results.push(...batchResults);
        // console.log(batchResults)
        startIndex += batchSize;
      } catch (error) {
        errorIndex = startIndex
        console.error(`Error processing batch starting at index ${startIndex}:`, error);
        // 处理错误，例如记录错误信息或停止执行
        break; // 停止执行，避免后续批次继续执行
      }
    }

    return [results, errorIndex];
  }
  ,
  	isGitHubRepo:function(url)
	{
		const githubRegex = /^https:\/\/github\.com\/[^/]+\/[^/#]+$/;
		return githubRegex.test(url);
	},

	roundNumber:function(number)
	{
		if (number < 1000) return number;

		const suffixes = ['', 'k', 'M', 'B', 'T'];

		const suffixIndex = Math.floor(Math.log10(number) / 3);
		const scaledNumber = number / Math.pow(10, suffixIndex * 3);

		const formattedNumber = scaledNumber % 1 === 0 ? scaledNumber.toFixed(0) : scaledNumber.toFixed(1);

		return `${formattedNumber}${suffixes[suffixIndex]}`;
	},
	// 缓存包装函数
	getCachedValue:function(key, defaultValue, expirationTime)
	{
		const cachedData =  GM_getValue(key);
		if (cachedData)
		{
			const
			{
				value,
				timestamp
			} = JSON.parse(cachedData);
			if (Date.now() - timestamp < expirationTime)
			{
				return value;
			}
		}
		return defaultValue;
	},

	setCachedValue:function(key, value)
	{
		const data = JSON.stringify(
		{
			value: value,
			timestamp: Date.now()
		});
		 GM_setValue(key, data);
	},
}


	function getSelector(url)
	{
		const selectors = [
		{
			pattern: /https?:\/\/github.com\/[^\/]+\/[^\/]+\/*$/,
			// selector: "#readme",
			selector: '.markdown-body',
		},
		{
			pattern: /https?:\/\/github.com\/.*\/[Rr][Ee][Aa][Dd][Mm][Ee]\.md$/i,
			selector: "article",
		},
		{
			pattern: /https?:\/\/github.com\/[^\/]+\/[^\/]+\/(issues|pull)\/\d+\/*$/,
			selector: ".comment-body",
		},
		{
			pattern: /https?:\/\/github.com\/[^\/]+\/[^\/]+\/wiki\/*$/,
			selector: "#wiki-body",
		}, ];

		const selector = selectors.find((
		{
			pattern
		}) => pattern.test(url))?.selector;
		return selector;
	}

	async function inject(selector, githubToken)
	{
		const allLinks = document.querySelectorAll(`${selector} a`);
		const injectPromises = [];

		allLinks.forEach((link) =>
		{
			if (Tools.isGitHubRepo(link.href) && !link.querySelector('strong#github-stars-14151312'))
			{
				injectPromises.push(injectStars(link, githubToken));
			}
		});

		// await Promise.all(injectPromises);
    const results = await Tools.runPromisesInBatches(injectPromises,10,0);
    if(results[1]) {
      console.warn('停止在了 ', results[1])
    }


		const uls = Array.from(document.querySelectorAll(`${selector} ul`)).filter(ul => ul.querySelectorAll(':scope > li').length >= 2);

		if (!uls) return;

		for (const ul of uls)
		{
			sortLis(ul);
		}

		function sortLis(ul)
		{
			const lis = Array.from(ul.querySelectorAll(":scope > li"));

			lis.sort((a, b) =>
			{
				const aStars = getHighestStars(a);
				const bStars = getHighestStars(b);

				return bStars - aStars;
			});

			for (const li of lis)
			{
				ul.appendChild(li);
			}
		}

		function getHighestStars(liElement)
		{
			const clonedLiElement = liElement.cloneNode(true);

			const ulElements = clonedLiElement.querySelectorAll("ul");
			for (const ulElement of ulElements)
			{
				ulElement.remove();
			}

			const starsElements = clonedLiElement.querySelectorAll("strong#github-stars-14151312");
			let highestStars = 0;

			for (const starsElement of starsElements)
			{
				const stars = parseInt(starsElement.getAttribute("stars"));
				if (stars > highestStars)
				{
					highestStars = stars;
				}
			}

			return highestStars;
		}

		async function injectStars(link, githubToken)
		{
        			const stats  = await getStars(link.href, githubToken)

				if (!stats) return;

				const strong = document.createElement("strong");
				strong.id = "github-stars-14151312";
				strong.setAttribute("stars", stats.stars);
				strong.style.color = "#fff";
				strong.style.fontSize = "12px";
				strong.innerText = `★ ${Tools.roundNumber(stats.stars)}`;
				strong.style.backgroundColor = "#093812";
				strong.style.paddingRight = "5px";
				strong.style.paddingLeft = "5px";
				strong.style.textAlign = "center";
				strong.style.paddingBottom = "1px";
				strong.style.borderRadius = "5px";
				strong.style.marginLeft = "5px";
				link.appendChild(strong);


		}
	}


	function getStars(githubRepoURL, githubToken)
	{
		const repoName = githubRepoURL.match(/github\.com\/([^/]+\/[^/]+)/)[1];


		const cacheKey = `github_stats_${currentPageRepo}_${repoName}`;

		// 尝试从缓存获取星标数
		const statsC =  Tools.getCachedValue(cacheKey, null, CACHE_EXPIRATION);
		if (statsC !== null)
		{
			return statsC;
		}

		return myFetch(`https://api.github.com/repos/${repoName}`,
		{
			headers:
			{
				Authorization: `Token ${githubToken}`
			},
		}).then((response) =>
		{
			const data =  response.json();
			const stats = {stars: data.stargazers_count,   forks_count: data.forks_count,
  open_issues_count: data.open_issues_count,
  created_at: data.created_at,
  pushed_at: data.pushed_at,
  archived: data.archived ,
  disabled: data.disabled ,
  };

			// 缓存星标数
			 Tools.setCachedValue(cacheKey, stats);

			return stats;

		}).catch((error) =>
		{
			console.error(`query stats for ${repoName} `,error)
		});;

	}


})();



// setGitHubToken

(async function setGitHubToken()
{
	'use strict';

	async function setGitHubToken()
	{
		const githubToken = GM_getValue("githubToken", "");

		const token = prompt(githubToken || "Please enter your GitHub Personal Access Token:");
		if (token)
		{

			// 验证 token
			myFetch(`https://api.github.com/user`,
			{
				headers:
				{
					Authorization: `Bearer ${token}`
				},
			}).then((response) =>
			{

				if (response.status !== 200)
				{
					console.warn("Invalid GitHub token. Please update it in the script settings.");
					return;
				}
				console.log('valid github token')

				GM_setValue("githubToken", token);

				alert("GitHub token has been set. Refresh the page to see the changes.");

			}).catch((error) =>
			{
				alert(error)
			});

		}


	}
	GM_registerMenuCommand("Config: Set GitHub Token and test it", setGitHubToken);


})();





// printGithubStatsCache
// clearGithubStatsCache

(function githubStatsCache()
{
	'use strict';

   GM_registerMenuCommand("Tool: Print Stats Cache", printGithubStatsCache);
  GM_registerMenuCommand("Tool: Delete Stats Cache", clearGithubStatsCache);

  function printGithubStatsCache(){
        const keys = GM_listValues();
    console.groupCollapsed('printGithubStatsCache')
    console.log('current cache number is ', keys.length)
        keys.forEach(key => {
          console.log(key,':',GM_getValue(key))
        });
    console.groupEnd('printGithubStatsCache')
  }

  function clearGithubStatsCache(){



    let pre = prompt("输入缓存前缀，默认是 github_stats_ 包含本脚本创建的所有统计缓存。特定repo页面上生成的统计缓存，前缀格式是 github_stats_<owner>/<name> ");
    if(!pre) pre='github_stats_'



    const keys = GM_listValues(); let n = 0;

    console.groupCollapsed('printGithubStatsCache for '+pre)
        keys.forEach(key => {
          if(key.startsWith(pre)){
            console.log(key,':',GM_getValue(key)); n++;
          }
        });
    console.log('cache number is ', n)
    console.groupEnd('printGithubStatsCache for '+pre)



    const sure = prompt("相关缓存已打印。确认要删除吗？请输入1");
    if(sure!=='1') return

        keys.forEach(key => {
          if(key.startsWith(pre))
            GM_deleteValue(key);
        });
  }

})();







// testGithubApi 没用 token
(function testGithubApi()
{
	'use strict';


	const shortcut = 'c-g c-g';
	// Register shortcut
	VM.shortcut.register(shortcut, testGithubApi);

	const name = '_Test: GithubApi without token';

	// Register menu command
	const menuName = `${name} (${VM.shortcut.reprShortcut(shortcut)})`;
	GM_registerMenuCommand(menuName, testGithubApi);


  function testGithubApi(){

    const repo = 'Zaid-Ajaj/Awesome' ; // 'vuejs/awesome-vue'

    const ur = ["https://api.github.com"];
    ur.push("repos", repo)

    const url = ur.join("/")
    console.debug('testGithubApi ' + url)



    GM_xmlhttpRequest(
    {
      url,
      headers:
      {

        "Accept": "application/vnd.github.v3+json",
      },
      onload: function (xhr)
      {
        console.debug(xhr.responseText);
      }
    });
  } // end testGithubApi


})();


