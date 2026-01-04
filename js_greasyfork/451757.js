// ==UserScript==
// @name PingCodeExportXLS
// @namespace PingCodeExportXLS
// @description PingCode导出需求
// @include http://*.pingcode.com/*
// @include https://*.pingcode.com/*
// @version 1.0.3
// @require      https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.15.1/xlsx.full.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/lodash.js/4.17.21/lodash.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.1/jquery.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/jqueryui/1.13.2/jquery-ui.min.js
// @run-at document-end
// @author Keyneko
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAcCAMAAABBJv+bAAAAhFBMVEVnmf9mmP9hlP9jlv/v9f9klv/w9v9fk//9/v9pmv+62P9ckf/z+P/N3v/H2v/////y9/++2v+Yvf+Cq//1+f/J4f/E3//C3f+Frv93pf/r8//Q4P+21v+mx/+Tuf97p/9zof/3+/+81P+20f+rzP+KsP9snf/f6v/U5P+xy/+Nsv9+qP88iwroAAABC0lEQVQoz33TaY/CIBAGYF7OctS2ag+19V73+v//b+kaWwipEz5AHmYyJAMJAuMKQ+tIk0C4FZQld2alIl/bRWUiLz4BLGom3UktK3fljvrDgsrsixKAIOkKo27lr4ImInav5PCvG6vV+s5iB5C/lD36ZhCx2x+vjnsF3VWmHQQLXW0uvJR1RwnouTKmvRI6O4j6znhtmk4RiHtr+v2BhfmwN96b6qYFGavXslgxBOlQQ2NMdaLwXjvHi6P1EPi69aygbcddKSeevTEPpu2H28qpeORH5bV0kmerqbXZGfwTn5rMxfNIDxc+qpg0dHrel5Om4TnU1PPijRLVXd9OK1MINHUSKRJG9In+AI32Dei1Xz4EAAAAAElFTkSuQmCC
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/451757/PingCodeExportXLS.user.js
// @updateURL https://update.greasyfork.org/scripts/451757/PingCodeExportXLS.meta.js
// ==/UserScript==

(function() {
  /**
   * 加载样式表
   * @param  {[type]} url [description]
   * @return {[type]}     [description]
   */
  function loadStyle(url) {
    const head = document.getElementsByTagName('head')[0];
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = url;
    link.media = 'all';
    head.appendChild(link);
  }

  /**
   * 导出xls
   * @return {[type]} [description]
   */
  function exportXLS(data, title = "导出需求") {
    const ws = XLSX.utils.json_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet 1')
    XLSX.writeFile(wb, `${title}.xlsx`)
  }

  /**
   * 对话框模板
   * @param  {[type]} fields [description]
   * @return {[type]}        [description]
   */
  function genDialogHtml(fields) {
    const dialogTmpl = _.template(`
      <div id="dialog" title="请选择要导出的字段">
        <% _.forEach(fields, function(field, index) { %>
        <% if (field) { %>
        <p>
          <label>
            <input type="checkbox" class="checkbox" value="<%= index %>" style="vertical-align: text-bottom;margin-right: 4px;" />
            <span>导出<%= field %></span>
          </label>
        </p>
        <% } %>
        <% }); %>
        <button class="ui-button ui-widget ui-corner-all" style="float:right">确定</button>
      </div>
    `)
    return dialogTmpl({ fields })
  }


  // -----------------------------------
  // 程序入口
  // 引入jquery-ui样式表
  loadStyle('https://cdn.bootcdn.net/ajax/libs/jqueryui/1.13.2/themes/base/jquery-ui.css')

  // 字段列表
  let fields = []

  // 轮询元素是否就位
  let timerId = setInterval(function() {
    const $moreBtn = $('.layout-header-operation .thy-action[thytooltip="更多"]')
    const $table = $('.styx-table-list')

    if ($moreBtn.length && $table.length) {
      clearInterval(timerId)
      console.log('@@检测到元素')

      // 提取字段
      $('.styx-table-header table > thead > th').each(function(index, el) {
        fields[index] = el.innerText
      })
      console.log('@@提取字段', fields)

      // 生成筛选字段对话框
      $(genDialogHtml(fields)).appendTo('body')

      // 点击更多按钮
      $moreBtn.off().click(function() {

        // 加个延时
        setTimeout(() => {
          $('.thy-dropdown-menu .dropdown-menu-item').each(function() {
            let labelTxt = $(this).text() || ''

            // 定位导出需求按钮
            let isExportBtn = labelTxt.includes('导出需求')
            if (isExportBtn) {
              console.log('@@定位到导出需求按钮')
              this.removeAllListeners()

              // 点击导出按钮
              $(this).off().click(function() {

                // 提取导出数据
                let data = []
                $('.styx-table-body td input[type=checkbox]:checked').each(function(idx) {
                  let obj = {}
                  let $tr = $(this).parents('tr')

                  $tr.find('td').each(function(index, el) {
                    obj[fields[index]] = el.innerText
                  })
                  data.push(obj)
                })

                if (!data.length) {
                  alert('请选择要导出的需求列表！')
                  return
                }
                console.log('@@提取数据', data)

                // 打开对话框
                $("#dialog").dialog()

                // 点击对话框确定按钮
                $("#dialog button").off().on("click", function(e) {
                  let selected = []

                  // 进行筛选
                  $("#dialog input[type=checkbox]:checked").each(function() {
                    selected.push(fields[this.value])
                  })

                  if (!selected.length) {
                    alert('请选择要导出的字段列表！')
                    return
                  }

                  data = _.map(data, d => _.pick(d, selected))
                  console.log('@@筛选数据', selected, data)

                  // 导出xls
                  exportXLS(data)

                  // 关闭对话框
                  $("#dialog").dialog("close")
                });

              })
            }
          })
        }, 500)

      })

    }
  }, 1000)

})()
