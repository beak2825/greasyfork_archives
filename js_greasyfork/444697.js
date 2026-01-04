// ==UserScript==
// @name         阿里云效伴侣
// @version      0.2.9
// @description  让工作更高效，让生活更美好!
// @author       Jack.Chan (971546@qq.com)
// @namespace    http://fulicat.com
// @homepage     https://greasyfork.org/zh-CN/scripts/444697
// @url          https://greasyfork.org/zh-CN/scripts/444697
// @license MIT
// @match        https://flow.aliyun.com/my*
// @match        https://flow.aliyun.com/all*
// @match        https://flow.aliyun.com/groups/*
// @match        https://flow.aliyun.com/pipelines/*/*
// @icon         https://img.alicdn.com/imgextra/i3/O1CN01TKugcB25GaoLOe5rA_!!6000000007499-55-tps-102-102.svg
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/444697/%E9%98%BF%E9%87%8C%E4%BA%91%E6%95%88%E4%BC%B4%E4%BE%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/444697/%E9%98%BF%E9%87%8C%E4%BA%91%E6%95%88%E4%BC%B4%E4%BE%A3.meta.js
// ==/UserScript==

// @icon         https://flow.aliyun.com/favicon.ico

(function() {
    'use strict';

    function initStyle() {
        var $style = document.createElement('style');
        $style.type = 'text/css';
        $style.innerHTML = `
.worktile-task-url{
    display: block;
    white-space: normal;
    word-break: break-all;
    padding: 2px;
}
.worktile-task-url p{
    margin: 0;
    padding: 2px;
}

.run-param-config .next-dialog-body .variable-input:not(.next-focus) {
    border-width: 1px !important;
}

.tb-navigator-container .tb-navigator-nav-inner{
    background-color: #e1f2ff !important;
    border-bottom: 1px solid #ddd;
}
.tb-common-sidebar-main-item.is-group-item .tb-common-sidebar-main-item-jsx{
    left: 10px;
    width: 185px;
}

.next-collapse-panel.next-collapse-panel-hidden>.next-collapse-panel-content{
    display: block !important;
    height: auto !important;
    opacity: 1 !important;
}

.tb-navigation-avatar img{
    border: 2px solid #ffffff;
    box-shadow: 0 0 10px 8px #4caf50;
}

.next-dialog-header.has-worktile{
    background-color: #e1f2ff !important;
    border-radius: 4px 4px 0 0 !important;
}

/* 再一次将阿里云效的流水线掰直 */
div[class*="PipelineGraph--PipelineJobs--"]>.canvasEntity>div{
    opacity: 1 !important;
}

.PipelineGraph--PipelineJobs--fixJobs>svg{
    visibility: hidden;
}
.PipelineGraph--PipelineJobs--next-job:before{
    content: "\\20";
    display: block;
    position: absolute;
    left: -56px;
    top: 30px;
    width: 60px;
    height: 2px;
    background-color: #c6cdd4;
}
.PipelineGraph--PipelineJobs--next-job:hover:before,
.PipelineGraph--PipelineJobs--has-next-job:hover + .PipelineGraph--PipelineJobs--next-job:before{
    background-color: #75B9ED;
}


/* 节点气泡最小高度, 防止抖动 */
.canvasEntity{
  .flow-job-new--header--lVYogx3{
    padding-top: 5px !important;
  }
  .flow-job-new--info--h9KGKQX{
    padding-top: 5px !important;
    padding-bottom: 5px !important;
  }

  .AnimatedContainer.flow-job-new--jobCard--el0hYeb{
    min-height: 99px;
    background: #fff;
  }
}
`;
        document.head.appendChild($style);
    }

    function getQueryString() {
        return Object.fromEntries(new URLSearchParams(location.search.substr(1) +'&'+ location.hash.split('?').pop()));
    }

    function doCopy(value, callback) {
        value = value === undefined || value === null ? '' : value;
        var $textarea = document.createElement('textarea');
        $textarea.style.cssText = "position:absolute;left:-20px;top: -20px;width:0;height:0;opacity: 0;";
        document.body.appendChild($textarea);
        $textarea.value = value;
        $textarea.select();
        setTimeout(() => {
            document.execCommand('Copy');
            document.body.removeChild($textarea);
            console.log('@copied:', value);
            if (typeof callback === 'function') {
                callback(value);
            }
        }, 150);
    }

    var query = getQueryString();

    var hasWatched = false;

    function fixJobs() {
        var needFixJobs = window.localStorage.getItem('pipelines_fixJobs') || '1';
        // reset fixJobs
        if (query.fixJobs === 'false' || query.fixJobs === '-1') {
            window.localStorage.removeItem('pipelines_fixJobs');
            needFixJobs = '1';
        }
        // disable fixJobs
        if (query.fixJobs === '0') {
            window.localStorage.setItem('pipelines_fixJobs', 0);
            needFixJobs = 0;
        }
        // console.log('needFixJobs:', needFixJobs);
        if (needFixJobs !== '1') return;

        var $jobsContainer = document.querySelector('div[class*="PipelineGraph--PipelineJobs--"]');
        if (!$jobsContainer) return;
        // var $jobs = document.querySelectorAll('div[class*="PipelineGraph--PipelineJobs--"]>.canvasEntity');
        var $jobs = $jobsContainer.querySelectorAll('div.canvasEntity');
        if (!$jobs) return;
        var jobId = null;
        var jobStyleTrasnform = null;
        var nextJob = null;
        var nextJobId = null;
        var nextJobStyleTrasnform = null;
        $jobs.forEach((item) => {
            if (item.childNodes.length) {
                jobId = item.childNodes[0].dataset.jobId;
                nextJob = document.querySelector('path[id*="@'+ jobId +'-->@"]');
                if (nextJob && nextJob.id) {
                    nextJobId = nextJob.id.split('-->@').pop();
                    item.dataset.jobId = jobId;
                    item.dataset.nextJobId = nextJobId;
                    nextJob = document.querySelector('.canvasEntity>[data-job-id="'+ nextJobId +'"]');
                    if (nextJob && nextJob.parentNode) {
                        nextJob = nextJob.parentNode;
                        item.classList.add('PipelineGraph--PipelineJobs--has-next-job');
                        nextJob.classList.add('PipelineGraph--PipelineJobs--next-job');
                        jobStyleTrasnform = item.style.transform.split(',');
                        nextJobStyleTrasnform = nextJob.style.transform.split(',');
                        nextJobStyleTrasnform[1] = jobStyleTrasnform[1];
                        nextJob.style.transform = nextJobStyleTrasnform.join(',');
                        $jobsContainer.classList.add('PipelineGraph--PipelineJobs--fixJobs');
                    }
                }
                /*if (!hasWatched) {
                    watchJob(item);
                    watchJob(nextJob);
                }*/
            }
        });

        /*if (!hasWatched) {
            hasWatched = true;
            console.log('hasWatched:', hasWatched);
        }*/
    }

    function watchJob($el) {
      if (!$el) return;
      var observer = new MutationObserver((entries) => {
          fixJobs();
          console.log('watchJob')
      });
      // 观察元素
      observer.observe($el, {
          //childList: true,
          attributes: true,
          subtree: true,
          characterData: true,
          attributeFilter: ['rows']
      });
    }


    var isDialogHasBind = false;
    var isHistoryHasBind = false;

    function run() {
        var pipelinesId = 0;
        var paths = window.location.pathname.split('/');
        // console.log('click.run:', paths);
        if (paths.length > 3 && !isNaN(paths[2])) {
            pipelinesId = paths[2];

            var $dialog = document.querySelector('.next-dialog');
            console.log('$dialog:', $dialog);
            var $dialogHeader = document.querySelector('.next-dialog-header');
            var $Branch = document.querySelector('.next-input>input[value="Branch"]');
            var $TaskURL = document.querySelector('.next-input>input[id="TASK_URL"]') || document.querySelector('.next-input>input[id="WorktileTask"]');
            var $BtnCancel = document.querySelector('.next-dialog-footer>button:nth-child(1)');
            var $BtnRun = document.querySelector('.next-dialog-footer>button:nth-child(2)');
            var $pageHistory = document.querySelector('.pipe-histories-container');
            var isReady = $Branch && $TaskURL && $BtnRun && $BtnRun?.innerText === '运行' && $BtnCancel;
            var isDialog = $Branch && $TaskURL && $BtnRun && $BtnRun?.innerText === '运行' && $BtnCancel;
            var isHistory = /pipelines\/(\d+)\/history/.test(window.location.pathname);
            var $task;
            if (pipelinesId) {

                fixJobs();

                if (isDialog) {
                  if ($dialogHeader) {
                      $dialogHeader.classList.add('has-worktile');
                  }

                  if (!isDialogHasBind) {

                      if ($BtnRun) {
                        $task = document.createElement('div');
                        $task.id = 'WorktileTaskURL';
                        $task.className = 'worktile-task-url';
                        $Branch.parentNode.parentNode.parentNode.appendChild($task);
                        $task.addEventListener('dblclick', function(event) {
                            event.preventDefault();
                            event.stopPropagation();
                            //doCopy($task.value);
                        }, false);

                        $TaskURL.addEventListener('dblclick', function(event) {
                            $TaskURL.select();
                        }, false);
                        $Branch.addEventListener('keydown', function(event) {
                            if ($Branch.timer) {
                                clearTimeout($Branch.timer);
                                $Branch.timer = undefined;
                            }
                        }, false);
                        $Branch.addEventListener('keyup', function(event) {
                            // if ($Branch.timer) {
                                //clearTimeout($Branch.timer);
                                //$Branch.timer = undefind;
                            // }

                            var branch = this.value.trim();
                            var key = 'pipelinesId:'+ pipelinesId +':'+ branch;
                            if (branch) {
                                var task = window.localStorage.getItem(key) || '';
                                console.log('@hasTask', key, task);
                                if (task) {
                                    $task.innerHTML = '<p>'+ task + '</p>' + (task ? '<a id="link-do-copy" href="#" style="user-select: none;">点击复制</a>' : '');
                                    var $linkDoCopy = $task.querySelector('#link-do-copy');
                                    $linkDoCopy.onclick = function(evt) {
                                        evt.preventDefault();
                                        evt.stopPropagation();

                                        doCopy(task, () => {
                                            $linkDoCopy.innerText = '复制成功';
                                            setTimeout(() => {
                                                $linkDoCopy.innerText = '点击复制';
                                            }, 1500);
                                        });
                                        return false;
                                    }
                                } else {
                                    $task.innerHTML = '<p><small style="user-select: none;color: red;">未找到关联需求/任务，请去Worktile查找或联系产品经理</small></p>';
                                }
                                $task.value = task;
                            } else {
                                $task.value = '';
                                $task.innerHTML = '';
                            }
                        }, false);
                        $BtnCancel.addEventListener('click', function(event) {
                            var branch = $Branch.value.trim();
                            var key = 'pipelinesId:'+ pipelinesId +':'+ branch;
                            if (branch) {
                                window.localStorage.removeItem(key);
                                console.log('@removed', key);
                            }
                        }, false);
                        $BtnRun.addEventListener('click', function(event) {
                            var branch = $Branch.value.trim();
                            var task = $TaskURL.value.trim();
                            var key = 'pipelinesId:'+ pipelinesId +':'+ branch;
                            if (branch && task) {
                                window.localStorage.setItem(key, task);
                                console.log('@saved', key, task);
                            }
                        }, false);

                        isDialogHasBind = true;
                      }
                    }
                    console.log('DialogReady:pipelinesId:'+ pipelinesId, 'isDialogHasBind:'+ isDialogHasBind);
                } else {
                  isDialogHasBind = false;
                }


                // 一键取消 历史流水线
                if (isHistory) {
                  if (!isHistoryHasBind && $pageHistory) {
                    var $pageHistoryPager = $pageHistory.querySelector('.next-pagination');
                    $pageHistoryPager.classList.remove('next-hide');
                    var $btnCancelAll = document.createElement('button');
                    $btnCancelAll.setAttribute('type', 'button');
                    $btnCancelAll.setAttribute('class', 'next-btn next-medium next-btn-primary btn-cancel-all');
                    $btnCancelAll.style.cssText = 'margin-left: 15px;';
                    $btnCancelAll.innerText = '一键取消';
                    $btnCancelAll.addEventListener('click', function(event) {
                      var currentPage = document.querySelector('.next-pagination-item.next-current').innerText;
                      document.querySelectorAll('ul.action').forEach((item, index) => {
                          (($action) => {
                              if (currentPage != '1' || (currentPage == '1' && index !== 0)) {
                                var $btn = $action.querySelector('li+li>button.isTwoToThreeCNCharBtn');
                                if ($btn) {
                                  console.log('click:', { currentPage, index });
                                  $btn.click();
                                }
                              }
                          })(item, index);
                      });
                    }, false);
                    $pageHistoryPager.appendChild($btnCancelAll);

                    isHistoryHasBind = true;
                  }

                  console.log('HistoryReady:pipelinesId:'+ pipelinesId, 'isHistoryHasBind:'+ isHistoryHasBind);
                }
            }

        }

    }

    function init() {

        var delay = 2000;

        document.body.addEventListener('mousedown', function(e) {
            var $yxdialog = document.querySelector('.yx-dialog');
            if ($yxdialog) {
                delay = 600;
            }

            setTimeout(() => {
                fixJobs();
            }, 360);

            setTimeout(() => {
                run();
            }, delay);

        }, false);

        setTimeout(() => {
            run();
			injectOneKeyClick();
        }, delay);

    }

    function reInit() {
      isDialogHasBind = false;
      isHistoryHasBind = false;

      var delay = 2000;
      setTimeout(() => {
          run();
      }, delay);
    }


	/*
	// start
	document.querySelectorAll('[class^="flow-job-new--flowJobRoot--"]>div>button.is-yunxiao.isOnlyIcon').forEach((item) => item.click())
	// details
	document.querySelectorAll('[class^="flow-job-new--runtimeOption--"]>div>button.is-yunxiao.isManualApprove').forEach((item) => item.click())
	// pass
	document.querySelectorAll('[class^="flow-job-new--runtimeOption--"]>div>button.is-yunxiao.isManualApprove.pass').forEach((item) => item.click())
	*/
	window.ONEKEY = {
		start() {
			var items = document.querySelectorAll('.viewPort>.contentWrap [class^="flow-job-new--flowJobRoot--"]>div>button.is-yunxiao.isOnlyIcon');
			if (!items || !items.length) {
				return alert('无 可运行的 流水线');
			}
			items.forEach((item) => item.click())
		},
		detail() {
			var items = document.querySelectorAll('.viewPort>.contentWrap [class^="flow-job-new--runtimeOption--"]>div>button.is-yunxiao.isManualApprove');
			if (!items || !items.length) {
				return alert('无 可获取详情的 流水线');
			}
			items.forEach((item) => item.click())
		},
		pass() {
			var items = document.querySelectorAll('.viewPort>.contentWrap [class^="flow-job-new--runtimeOption--"]>div>button.is-yunxiao.isManualApprove.pass');
			if (!items || !items.length) {
				return alert('无 可通过的 流水线');
			}
			items.forEach((item) => item.click())
		}
	}

	function injectOneKeyClick() {
		if (!/^\/pipelines\//i.test(window.location.pathname)) {
			return;
		}
		var $layoutTitleLeft = document.querySelector('.teamix-layout-title-left');
		if ($layoutTitleLeft && !$layoutTitleLeft.querySelector('.one-key-action')) {
			var $section = document.createElement('section');
			$section.className = 'one-key-action';
			$section.innerHTML = `
<button type="button" class="next-btn next-medium next-btn-primary btn-one-key-action" data-action="start"><span class="next-btn-helper">一键开始</span></button>
<button type="button" class="next-btn next-medium next-btn-primary btn-one-key-action" data-action="detail"><span class="next-btn-helper">加载详情</span></button>
<button type="button" class="next-btn next-medium next-btn-primary btn-one-key-action" data-action="pass"><span class="next-btn-helper">一键通过</span></button>
`.trim();
			$layoutTitleLeft.appendChild($section);
			$section.$actions = $section.querySelectorAll('.btn-one-key-action');
			$section.$actions.forEach((item) => {
				((btn) => {
					btn.addEventListener('click', function(event) {
						var action = this.dataset.action;
						console.log('action:', action);
						if (window.ONEKEY[action]) {
							window.ONEKEY[action]();
						}
					});
				})(item);
			});
		}
	}


    if (document.contentType.startsWith('text/html')) {

        initStyle();

        init();



        (function(history){
          window.onpopstate = window.onpushstate = (event) => {
            reInit();
          }

          var pushState = history.pushState;
          var replaceState = history.replaceState;
          history.pushState = function(state) {
            reInit();
            return pushState.apply(history, arguments);
          };
          history.replaceState = function(state) {
            reInit();
            return replaceState.apply(history, arguments);
          };
        })(window.history);


    }

})();