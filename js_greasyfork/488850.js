// ==/UserScript==
// @version               1.0
// ==/UserScript==

; (() => {
  /**
   * # 使用方法
   * ```js
   * await concurrentTasks(5, [1, 2, 3, 4], (n) => {
   *   return new Promise((ok) => {
   *     setTimeout(() => {
   *       console.log(n);
   *       ok();
   *     }, Math.random() * 5000);
   *   });
   * });
   * ```
   * @template T
   * @param {number} limit - 并发数
   * @param {T[] | NodeListOf<T>} tasks - 可迭代对象
   * @param {(task:T) => Promise<void>} asyncCallback - Promise 回调函数
   * @returns {Promise<void>}
   */
  const concurrentTasks = async (limit, tasks, asyncCallback) => {
    limit = Math.min(limit, tasks.length);
    let index = 0;
    const run = async () => {
      while (index < tasks.length) {
        await asyncCallback(tasks[index++]);
      }
    };
    const runTaks = Array.from({ length: limit }, () => run());
    await Promise.all(runTaks);
  };

  window.concurrentTasks = concurrentTasks;
})();
