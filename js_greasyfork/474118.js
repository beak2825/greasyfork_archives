// ==UserScript==
// @name         Dataphin
// @namespace    http://tampermonkey.net/dataphin.customer.ui
// @version      0.7.1
// @description  dataphin.customer.ui
// @author       alperln@163.com Lv Ning
// @match        https://dataphin.sgm.saic-gm.com/public/*
// @match        https://www.baidu.com/favicon.ico
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.7.1/jquery.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/jqueryui/1.13.2/jquery-ui.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/jquery-cookie/1.4.1/jquery.cookie.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/blueimp-md5/2.19.0/js/md5.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/vue/2.7.14/vue.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/vuex/3.6.2/vuex.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/vue-router/3.6.5/vue-router.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/element-ui/2.15.14/index.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/codemirror/5.62.0/codemirror.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/codemirror/5.62.0/mode/sql/sql.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/codemirror/5.62.0/mode/javascript/javascript.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/codemirror/5.62.0/mode/markdown/markdown.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/codemirror/5.62.0/addon/selection/active-line.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/codemirror/5.62.0/addon/edit/closebrackets.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/codemirror/5.62.0/addon/edit/matchbrackets.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/codemirror/5.62.0/addon/display/fullscreen.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/codemirror/5.62.0/addon/comment/comment.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/Sortable/1.15.0/Sortable.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/echarts/5.4.3/echarts.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/moment.js/2.29.4/moment.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/handsontable/8.3.2/handsontable.full.min.js
// @icon         https://dataphin.sgm.saic-gm.com/public/icon.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/474118/Dataphin.user.js
// @updateURL https://update.greasyfork.org/scripts/474118/Dataphin.meta.js
// ==/UserScript==


(function() {

  class API{

    static query(params) {
      return new Promise(function(resolve, reject) {
        $.ajax({
          url: '/api/dataProcess/'+ params.projectId +'/files/'+ params.fileId +'/tempquery/debug?lock='+ params.lockId,
          type: "POST",
          headers: {
            'Content-Type': 'application/json'
          },
          data: JSON.stringify({
            sqltext: params.sqltext,
            operatorTypeCode: 25
          }),
          success(data, status) {
            resolve(data)
          },
          error(xhr, status, error) {
            reject(error)
          }
        })
      })
    }

    static queryLog(params) {
      return new Promise(function(resolve, reject) {
        $.ajax({
          url: '/api/smc/project/'+ params.projectId +'/query/'+ params.queryId +'/index/0/log?offset=' + params.offset,
          type: "GET",
          headers: {
            'Content-Type': 'application/json'
          },
          success(data, status) {
            resolve(data)
          },
          error(xhr, status, error) {
            reject(error)
          }
        })
      })
    }

    static queryResult(params) {
      return new Promise(function(resolve, reject) {
        $.ajax({
          url: '/api/smc/project/'+ params.projectId +'/query/'+ params.queryId +'/index/0/result',
          method: "GET",
          headers: {
            'Content-Type': 'application/json'
          },
          success(data, status) {
            resolve(data)
          },
          error(xhr, status, error) {
            reject(error)
          }
        })
      })
    }

    static stopQuery(params) {
      return new Promise(function(resolve, reject) {
        $.ajax({
          url: '/api/dataProcess/'+ params.projectId +'/files/'+ params.fileId +'/tempquery/stopdebug?lock='+ params.lockId,
          type: "POST",
          headers: {
            'Content-Type': 'application/json'
          },
          data: params.queryId,
          success(data, status) {
            resolve(data)
          },
          error(xhr, status, error) {
            reject(error)
          }
        })
      })
    }

    static resource(params) {
      return new Promise(function(resolve, reject) {
        $.ajax({
          url: '/api/resource/file/'+ params.fileId + '?projectId=' + params.projectId + '&fileId=' + params.fileId + '&_=' + params._,
          type: "GET",
          headers: {
            'Content-Type': 'application/json'
          },
          success(data, status) {
            resolve(data)
          },
          error(xhr, status, error) {
            reject(error)
          }
        })
      })
    }

  }


  // 加载样式

  let link = $('<link>').attr({
    rel: 'stylesheet',
    type: 'text/css',
    href: 'https://cdn.bootcdn.net/ajax/libs/element-ui/2.15.14/theme-chalk/index.min.css'
  })
  $('head').append(link)

  link = $('<link>').attr({
    rel: 'stylesheet',
    type: 'text/css',
    href: 'https://cdn.bootcdn.net/ajax/libs/codemirror/5.65.2/codemirror.min.css'
  })
  $('head').append(link)

  link = $('<link>').attr({
    rel: 'stylesheet',
    type: 'text/css',
    href: 'https://cdn.bootcdn.net/ajax/libs/codemirror/5.65.2/theme/base16-light.min.css'
  })
  $('head').append(link)

  link = $('<link>').attr({
    rel: 'stylesheet',
    type: 'text/css',
    href: 'https://cdn.bootcdn.net/ajax/libs/codemirror/5.65.2/theme/base16-dark.min.css'
  })
  $('head').append(link)

  link = $('<link>').attr({
    rel: 'stylesheet',
    type: 'text/css',
    href: 'https://cdn.bootcdn.net/ajax/libs/handsontable/8.3.2/handsontable.full.min.css'
  })
  $('head').append(link)

  link = $('<link>').attr({
    rel: 'stylesheet',
    type: 'text/css',
    href: 'https://cdn.bootcdn.net/ajax/libs/jqueryui/1.13.2/themes/base/jquery-ui.min.css'
  })
  $('head').append(link)


  // 加载自定义样式

  let style = $('<style>').text(`
    #app{
      position:absolute;
      top:0;
      left:0;
      height:100%;
      width:100%;
      z-index:1000;
      background-color: white;
    }
    body{
      font-family: Arial;
      font-size: 12px;
    }
    .el-textarea__inner{
      font-family: Arial;
    }
    .input-with-select .el-input {
      width: 100px;
    }
    .input-with-select .el-input-group__prepend {
      background-color: #fff;
    }
    .el-primary{
      color: #409eff;
    }
    .el-success{
      color: #67c23a;
    }
    .el-warning{
      color: #e6a23c;
    }
    .el-danger{
      color: #f56c6c;
    }
    .el-autocomplete{
      width: 500px;
    }
    .el-tip{
      height: 100%;
      margin-top: 10px;
      overflow: auto;
      padding: 8px 16px;
      color: 737379;
      background-color: #fafafa;
      border-radius: 4px;
      border-left: 5px solid #737379;
    }
    .el-card__header {
      padding: 10px 15px;
      border-bottom: 1px solid #EBEEF5;
      box-sizing: border-box;
    }
    .el-card__body, .el-main {
      padding: 15px;
    }
    .el-tabs__item {
      padding: 0 20px;
      height: 30px;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      line-height: 30px;
      display: inline-block;
      list-style: none;
      font-size: 14px;
      font-weight: 500;
      color: #303133;
      position: relative;
    }
  `)
  $('head').append(style)


  // 注册组件

  Vue.component('api-temp-query', {
    props: {
      sqltext: String
    },
    template: `
      <div>
        <div v-if="loading" class="el-loading-mask">
          <div ref="log" class="text item" style="font-size:8px; height: 100%; overflow: auto; background-color: #fafafa">
            <pre>{{ log }}</pre>
            <div v-show="toolbar" style="width:100%; text-align: center">
              <el-button @click="restart" size="small">重试</el-button>
            </div>
            <div style="margin: 10px 0;"></div>
          </div>
        </div>
      </div>
    `,
    data() {
      return {
        queryId: '',
        offset: '0',
        log: '',
        result: [[]],
        timers: [],
        running: false,
        toolbar: false
      }
    },
    computed: {
      refresh() {
        return this.$store.state.refresh
      },
      params() {
        return this.$store.state.params
      },
      loading() {
        return this.params.editable === false
            && (this.log !== '' || this.running === true)
             ? true 
             : false
      }
    },
    watch: {
      log() {
        this.scrollTop()
      },
      refresh() {
        this.scrollTop()
      },
      result() {
        this.log = ''
        this.running = false
        this.$emit('completed', this.result)
      }
    },
    methods: {
      start() {
        if (this.sqltext !== '' && !this.running) {
          this.log = ''
          this.running = true
          this.toolbar = false
          switch (this.params.apiModel) {
            case 'test':
              this.test()
              break
            case 'error':
              this.log = 'error error error error error'
              this.error('error')
              break
            default:
              this.query()
          }
        }
      },
      restart() {
        this.toolbar = false
        this.start()
      },
      test() {
        setTimeout(() => {
          this.log = 'test test test test test test test test'
          console.log('api test', this.sqltext, '\n' + new Date())
          setTimeout(() => {
            this.result = [
              ['A', 'B', 'C', 'D', 'E', 'F'],
              [5, 20, 36, 10, 10, 20],
              [5, 20, 36, 10, 10, 20],
              [5, 20, 36, 10, 10, 20],
              [5, 20, 36, 10, 10, 20],
              [5, 20, 36, 10, 10, 20],
              [5, 20, 36, 10, 10, 20],
              [5, 20, 36, 10, 10, 20],
              [5, 20, 36, 10, 10, 20],
              [5, 20, 36, 10, 10, 20],
              [5, 20, 36, 10, 10, 20],
              [5, 20, 36, 10, 10, 20],
              [5, 20, 36, 10, 10, 20],
              [5, 20, 36, 10, 10, 20],
              [5, 20, 36, 10, 10, 20],
              [5, 20, 36, 10, 10, 20],
              [5, 20, 36, 10, 10, 20],
              [5, 20, 36, 10, 10, 20],
              [5, 20, 36, 10, 10, 20],
              [5, 20, 36, 10, 10, 20],
              [5, 20, 36, 10, 10, 20],
              [5, 20, 36, 10, 10, 20],
              [5, 20, 36, 10, 10, 20],
              [5, 20, 36, 10, 10, 20],
              [5, 20, 36, 10, 10, 20],
              [5, 20, 36, 10, 10, 20],
              [5, 20, 36, 10, 10, 20],
              [5, 20, 36, 10, 10, 20],
              [5, 20, 36, 10, 10, 20],
              [5, 20, 36, 10, 10, 20],
              [5, 20, 36, 10, 10, 20]
            ]
          }, 1000)
        }, 1000)
      },
      query() {
        API.query({
          ...this.params,
          sqltext: this.sqltext
        }).then((data) => {
          if(data.code === '0') {
            this.queryId = data.data.queryId
            this.queryLog()
          }else {
            this.error(data.message)
          }
        }).catch((error) => {
          this.error(error)
        })
      },
      queryLog() {
        API.queryLog({
          projectId: this.params.projectId,
          queryId: this.queryId,
          offset: this.offset
        }).then((data) => {
          if(data.code === '0') {
            let res = data.data.taskrunLog
            if(res.content !== '') {
              this.log += res.content
            }
            if(res.hasNextLog) {
              this.offset = res.nextLogOffset
              let timerId = setTimeout(() => { this.queryLog() }, 1000)
              this.timers.push(timerId)
            }
            if (res.status === 'SUCCESS') {
              this.queryResult()
            } else if(res.status === 'FAILED') {
              this.error('SQL FAILED')
            }
          }else {
            this.error(data.message)
          }
        }).catch((error) => {
          this.error(error)
        })
      },
      queryResult(queryId) {
        API.queryResult({
          projectId: this.params.projectId,
          queryId: this.queryId
        }).then((data) => {
          let result = []
          let index = data.data.result.indexOf("\n")
          if (index !== -1) {
             result = eval("("+ data.data.result.slice(index + 1) +")")
          } else {
             result = eval("("+ data.data.result +")")
          }
          if (result[0][0] === 'header__') {
            let header = eval("(" + result[1][0] + ")")
            let body = eval("(" + result[1][1] + ")")
            this.result = [header, ...body]
          }else {
            this.result = result
          }
        }).catch((error) => {
          this.error(error)
        })
      },
      stopQuery() {
        API.stopQuery({
          ...this.params,
          queryId: this.queryId
        })
      },
      error(err) {
        this.running = false
        this.toolbar = true
        this.$emit('error', err)
      },
      scrollTop() {
        this.$nextTick(() => {
          if(this.$refs.log !== undefined) {
            this.$refs.log.scrollTop = 999999
          }
        })
      }
    },
    beforeDestroy() {
      this.timers.forEach((timerId) => {
        clearTimeout(timerId)
      })
      if (this.running) {
        this.stopQuery()
      }
    }
  })


  Vue.component('comp-table', {
    props: {
      result: Array
    },
    template: `
      <div class="comp-table" style="min-height: 500px">
        <el-table :data="tableData"
                  border
                  size="small"
                  style="width: 100%"
                  :header-cell-style="{'color': '#737379', 'background-color': '#fafafa'}">
          <el-table-column  v-for="(column, index) in columns"
                            :key="index"
                            :prop="column.prop"
                            :label="column.label"
                            :width="column.width"
                            show-overflow-tooltip>
          </el-table-column>
        </el-table>
        <div style="margin-top: 10px; text-align: center">
          <el-pagination  @size-change="handleSizeChange"
                          @current-change="handleCurrentChange"
                          :current-page="currentPage"
                          :page-sizes="[10, 20, 30, 50]"
                          :page-size="pageSize"
                          layout="total, sizes, prev, pager, next, jumper"
                          :total="total"
                          hide-on-single-page>
          </el-pagination>
        </div>
      </div>
    `,
    data() {
      return {
        currentPage: 1,
        pageSize: 10
      }
    },
    computed: {
      columns() {
        return this.result.length === 0 ? [] : this.result[0].map((col) => {
          return {
            prop: col,
            label: col,
            width: col.length * 10 < 100 ? 100 : col.length * 10
          }
        })
      },
      tableData() {
        return this.result.filter((item, index) => {
          return index > 0
        }).filter((item, index) => {
          return index >= (this.currentPage - 1) * this.pageSize
              && index < this.currentPage * this.pageSize
        }).map((row) => {
          let temp = {}
          this.result[0].map((col, index) => {
            temp[col] = row[index]
          })
          return temp
        })
      },
      total() {
        return this.result.length - 1
      }
    },
    methods: {
      handleSizeChange(pageSize) {
        this.pageSize = pageSize
      },
      handleCurrentChange(currentPage) {
        this.currentPage = currentPage
      },
      saveArrayToCSV() {
        const text = '\uFEFF' + this.result.map((row) => {
          return row.map((item) => {
            return item === null ? null : `"${item}"`
          }).join(',')
        }).join('\n')
        const blob = new Blob([text], {type: 'text/csv;charset=utf-8;'})
        const anchorElement = document.createElement('a')
        anchorElement.href = URL.createObjectURL(blob)
        anchorElement.download = 'export.csv'
        anchorElement.click()
      }
    }
  })


  Vue.component('comp-handsontable', {
    props: {
      result: Array,
      height: String,
      downloadable: {
        type: Boolean,
        default: false
      }
    },
    template: `
      <div>
        <div v-show="downloadable" style="text-align: right;margin-bottom: 10px;">
          <el-button @click="saveArrayToCSV" size="small"><i class="el-icon-download el-success"></i>&nbsp下载</el-button>
        </div>
        <div ref="table"></div>
      </div>
    `,
    computed: {
      tableData() {
        return this.result.filter((item, index) => {
          return index > 0
        })
      },
      columns() {
        return this.result.length === 0 ? [] : this.result[0]
      }
    },
    watch: {
      result() {
        this.refresh()
      },
      height() {
        this.table.updateSettings({
          height: this.height === '' ? 600 : this.height
        })
      }
    },
    mounted() {
      this.table = new Handsontable(this.$refs.table, {
        data: this.tableData,
        colHeaders: this.columns,
        //editor: false,
        rowHeaders: true,
        columnSorting: true,
        height: this.height || 600,
        virtualScroll: true,
        dropdownMenu: true,
        filters: true,
        contextMenu: true,
        licenseKey: 'non-commercial-and-evaluation'
      })
    },
    methods: {
      refresh() {
        this.table.updateSettings({
          data: this.tableData,
          colHeaders: this.columns
        })
      },
      saveArrayToCSV() {
        const text = '\uFEFF' + this.result.map((row) => {
          return row.map((item) => {
            return item === null ? null : `"${item}"`
          }).join(',')
        }).join('\n')
        const blob = new Blob([text], {type: 'text/csv;charset=utf-8;'})
        const anchorElement = document.createElement('a')
        anchorElement.href = URL.createObjectURL(blob)
        anchorElement.download = 'export.csv'
        anchorElement.click()
      }
    },
    beforeDestroy() {
      this.table.destroy()
      this.chart = null
    }
  })


  Vue.component('comp-chart', {
    props: {
      option: Object
    },
    template: `
      <div ref="chart" style="width: 100%; height: 100%"></div>
    `,
    mounted() {
      this.refresh()
      window.addEventListener('resize', this.resize)
    },
    watch: {
      option() {
        this.refresh()
      },
      "$store.state.refresh"() {
        if(this.$refs.chart.offsetParent !== null) {
          this.refresh()
        }
      }
    },
    methods: {
      refresh() {
        if (this.chart) {
          this.chart.dispose()
        }
        this.chart = echarts.init(this.$refs.chart)
        if (this.option !== undefined) {
          this.chart.setOption(this.option)
        }
        this.resize()
      },
      resize() {
        this.chart.resize()
      }
    },
    beforeDestroy() {
      window.removeEventListener('resize', this.resize)
      this.chart.dispose()
      this.chart = null
    }
  })


  Vue.component('comp-code-editor', {
    props: {
      text: String,
      mode: String,
      theme: String,
      readOnly: {
        type: Boolean,
        default: false
      },
      fullScreen: {
        type: Boolean,
        default: true
      }
    },
    template: `
      <div>
        <textarea ref="codeEditor"></textarea>
      </div>
    `,
    methods: {
      setValue() {
        this.codeMirror.setValue(this.text)
      }
    },
    watch: {
      text() {
        if (this.readOnly) {
          this.codeMirror.setValue(this.text)
        }
      }
    },
    mounted() {
      const textarea = this.$refs.codeEditor
      this.codeMirror = CodeMirror.fromTextArea(textarea, {
        // lineNumbers: true,
        styleActiveLine: true,
        tabSize: 2,
        indentUnit: 2,
        // lineWrapping: true,
        autoCloseBrackets: true,
        fullScreen: this.fullScreen,
        matchBrackets: true,
        mode: this.mode,
        theme: this.theme,
        readOnly: this.readOnly,
        extraKeys: {
          "F11"(cm) {
            cm.setOption("fullScreen", !cm.getOption("fullScreen"))
          },
          "Esc"(cm) {
            if (cm.getOption("fullScreen")) cm.setOption("fullScreen", false)
          },
          "Ctrl-/": "toggleComment",
          "Ctrl-L"(cm) {
            let lineStart = cm.getCursor().line
            let lineEnd = lineStart + 1
            cm.setSelection(
              { line: lineStart, ch:0 },
              { line: lineEnd, ch:0 }
            )
          },
          "Ctrl-B"(cm) {
            navigator.clipboard.writeText(JSON.stringify(cm.getValue()))
          }
        }
      })
      this.codeMirror.setValue(this.text)
      this.codeMirror.on('change', () => {
        this.$emit('updated', this.codeMirror.getValue())
      })
    },
    methods: {},
    beforeDestroy() {
      this.codeMirror.toTextArea()
      this.codeMirror = null
    }
  })


  Vue.component('view-chart-editor-old', {
    props: {
      result: Array,
      text: {
        type: String,
        default: ''
      }
    },
    template: `
      <div class="view-chart-editor-old"
        <el-row :gutter="20">
          <el-col :span="12">
            <comp-chart ref="chart" :option="option" style="width: 100%; height: 500px;"></comp-chart>
          </el-col>
          <el-col :span="12">
            <comp-code-editor :text="myText"
                              mode="text/javascript"
                              theme="base16-dark"
                              @updated="updated"></comp-code-editor>
          </el-col>
        </el-row>
      </div>
    `,
    data() {
      return {
        myText: ''
      }
    },
    created() {
      this.myText = this.text
    },
    computed: {
      option() {
        let result = this.result
        let option = {}
        // 尝试获取参数
        try {
          eval(this.myText)
        } catch(error) {
          // console.error(error)
        }
        return option
      },
    },
    mounted() {},
    methods: {
      updated(text) {
        this.myText = text
      }
    }
  })


  Vue.component('view-query-result-tab-pane', {
    props: {
      sqltext: String,
      charts: {
        type: Array,
        default: []
      }
    },
    template: `
      <div class="view-query-result-tab-pane">
        <api-temp-query ref="apiTempQuery"
                        :sqltext="sqltext"
                        @completed="handleCompleted"
                        @error="handleError"></api-temp-query>

        <el-tabs  v-model="activeTabName"
                  tab-position="right"
                  style="height: 100%"
                  @tab-click="handleTabClick">
          <el-tab-pane label="数据" name="table" style="min-height: 500px">
            <div v-show="editable" style="text-align: right;margin-bottom: 10px;">
              <el-select v-model="tableType" size="small">
                <el-option label="element-ui" value="element-ui"></el-option>
                <el-option label="Handsontable" value="Handsontable"></el-option>
              </el-select>
              <el-button @click="saveArrayToCSV" size="small"><i class="el-icon-download el-success"></i>&nbsp下载</el-button>
            </div>
            <comp-table v-if="tableType==='element-ui'" :result="result"></comp-table>
            <comp-handsontable v-else-if="tableType==='Handsontable'" :result="result"></comp-handsontable>
          </el-tab-pane>
          <el-tab-pane  v-for="(tab, index) in tabs"
                        :label="tab.label"
                        :name="tab.name">
            <view-chart-editor-old :result="result"
                               :text="tab.text"></view-chart-editor-old>
          </el-tab-pane>
          <el-tab-pane label="新增" name="addTab"></el-tab-pane>
        </el-tabs>

      </div>
    `,
    data() {
      return {
        showTable: false,
        result: [[]],
        activeTabName: 'table',
        index: 1,
        tabs: [],
        tableType: ''
      }
    },
    created() {
      this.tableType = this.$store.state.params.tableType
    },
    mounted() {
      this.query()
    },
    computed: {
      editable() {
        return this.$store.state.params.editable
      }
    },
    methods: {
      query() {
        this.$refs.apiTempQuery.start()
      },
      init() {
        this.tabs = this.charts.map((chart) => {
          return {
            label: chart.label,
            name: 'chart_' + this.index++,
            text: typeof(chart.option) === 'object' ? JSON.stringify(chart.option, null, 2) : chart.option
          }
        })
        if (this.charts.length !== 0) {
          this.activeTabName = 'chart_1'
        }
      },
      handleTabClick(tab) {
        this.$store.commit('refresh')
        switch(tab.name) {
          case 'addTab':
            this.addTab()
            break
        }
      },
      handleCompleted(result) {
        if (result[0][0] === 'download__') {
          let header = this.sqltext.split('@header')[1].split('\n')[0]
          header = eval('([' + header + '])')
          this.result = eval("(" + result[1] + ")")
          this.result.unshift(header)
        }else {
          this.result = result
        }
      },
      handleError(error) {
        this.$message({
          message: error,
          type: 'error'
        })
      },
      addTab(option) {
        let newTabName = 'chart_' + this.index++
        this.tabs.push({
          label: '图表',
          name: newTabName
        })
        this.activeTabName = newTabName
      },
      saveArrayToCSV() {
        const text = '\uFEFF' + this.result.map((row) => {
          return row.map((item) => {
            return item === null ? null : `"${item}"`
          }).join(',')
        }).join('\n')
        const blob = new Blob([text], {type: 'text/csv;charset=utf-8;'})
        const anchorElement = document.createElement('a')
        anchorElement.href = URL.createObjectURL(blob)
        anchorElement.download = 'export.csv'
        anchorElement.click()
      }
    }
  })


  Vue.component('view-query-result-tabs', {
    props: {
      tabs: Array,
      newTabName: String
    },
    template: `
      <div class="view-query-result-tabs">
        <el-card class="box-card">
          <el-tabs  v-model="activeTabName"
                    type="card"
                    @tab-remove="removeTab"
                    @tab-click="handleTabClick">
            <el-tab-pane  v-for="(tab, index) in tabs"
                          :key="tab.name"
                          :label="tab.label"
                          :name="tab.name"
                          closable>
              <view-query-result-tab-pane :sqltext="tab.sqltext"
                                :charts="tab.charts"></view-query-result-tab-pane>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </div>
    `,
    watch: {
      newTabName() {
        this.activeTabName = this.newTabName
      }
    },
    data() {
      return {
        activeTabName: ''
      }
    },
    methods: {
      removeTab(tabName) {
        this.$emit('removeTab', tabName)
      },
      handleTabClick(tab) {
        this.$store.commit('refresh')
      }
    }
  })


  const pageSqlEditor = Vue.component('page-sql-editor', {
    props: {
      sqltext: String
    },
    template: `
      <div class="page-sql-editor">
        <el-card class="box-card" style="margin-bottom: 10px">
          <div  slot="header"
                class="clearfix"
                ref="header"
                @click="collapse">
            <span style="font-size:14px; font-weight:bold; color: #737379;">即席查询</span>
            <el-button  @click.stop="query"
                        style="float: right; padding: 3px 0; font-weight:bold;"
                        type="text">运行</el-button>
          </div>
          <el-collapse-transition>
            <div v-show="isExpanded">
              <comp-code-editor ref="editor"
                                :text="sqltext"
                                mode="text/x-sql"
                                theme="base16-light"
                                @updated="updated"></comp-code-editor>
            </div>
          </el-collapse-transition>
        </el-card>

        <view-query-result-tabs  :tabs="tabs"
                          :new-tab-name="newTabName"
                          @removeTab="handleRemoveTab"></view-query-result-tabs>

      </div>
    `,
    data() {
      return {
        sqltext: '',
        isExpanded: true,
        index: 1,
        tabs: [],
        newTabName: ''
      }
    },
    mounted() {},
    methods: {
      collapse() {
        this.isExpanded = !this.isExpanded
      },
      query() {
        this.newTabName = 'result_' + this.index++
        this.tabs.push({
          label: this.newTabName,
          name: this.newTabName,
          sqltext: this.sqltext
        })
      },
      updated(text) {
        this.sqltext = text
      },
      handleRemoveTab(tabName) {
        this.$confirm('是否删除？', '提示', {
          type: 'warning'
        }).then(() => {
          let index = this.tabs.findIndex((item) => {
            return item.name === tabName
          })
          let nextTab = this.tabs[index + 1] || this.tabs[index - 1]
          if (nextTab) {
            this.newTabName = nextTab.name
          }
          this.tabs.splice(index, 1)
        }).catch((err) => {
          // ...
        })

      }
    }
  })


  Vue.component('view-query-condition-card', {
    props: {
      title: String,
      sqltext: String,
      tables: Array
    },
    template: `
      <div class="view-query-condition-card">
        <el-card style="margin-bottom: 10px">
          <div  slot="header"
                class="clearfix"
                ref="header"
                @click="collapse">
            <span style="font-size:14px; font-weight:bold; color: #737379;">{{title}}</span>
            <el-button  @click.stop="query"
                        style="float: right; padding: 3px 0; font-weight:bold;"
                        type="text">查询</el-button>
          </div>

          <el-collapse-transition>
            <div v-show="isExpanded">

              <div class="toolbar" style="margin-bottom: 10px">
                <el-autocomplete v-model="tableName"
                                  size="small"
                                  :fetch-suggestions="querySearch"
                                  @change="tableChange"
                                  @select="tableSelect"
                                  placeholder="表名"></el-autocomplete>
                  <el-button  @click="download" size="small">
                    <i :class="{'el-icon-loading': !downloadable, 'el-warning': !downloadable, 'el-icon-success': downloadable, 'el-success': downloadable}"></i>&nbsp全量查询
                  </el-button>
                <div style="float: right;">
                  <el-button-group>
                    <el-button  @click="refresh"
                                size="small"><i class="el-icon-refresh el-warning"></i>&nbsp刷新</el-button>
                    <el-button  @click="addRow"
                                size="small"><i class="el-icon-circle-plus el-primary"></i>&nbsp新增</el-button>
                    <el-button  @click="deleteRows"
                                size="small"><i class="el-icon-delete-solid el-danger"></i>&nbsp删除</el-button>
                  </el-button-group>
                </div>

              </div>


              <el-table ref="table"
                        :data="tableData"
                        @selection-change="handleSelectionChange"
                        border
                        size="small"
                        style="width: 100%"
                        :header-cell-style="{'color': '#737379', 'background-color': '#fafafa'}">
                <el-table-column  type="selection"
                                  width="40"></el-table-column>
                <el-table-column  label="字段"
                                  prop="column"
                                  width="300">
                  <template slot-scope="scope">
                    <div @pointerdown.stop>
                      <el-input v-model="scope.row.column"
                                size="small"
                                placeholder="填写字段名"></el-input>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column  label="别名"
                                  prop="alias"
                                  width="200">
                  <template slot-scope="scope">
                    <div @pointerdown.stop>
                      <el-input v-model="scope.row.alias"
                                size="small"
                                placeholder="自定义别名"></el-input>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column  label="查询类型"
                                  prop="type"
                                  width="150">
                  <template slot-scope="scope">
                    <div @pointerdown.stop>
                      <el-select v-model="scope.row.type" size="small" clearable>
                        <el-option  v-for="item in options"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                        </el-option>
                      </el-select>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column  label="查询条件"
                                  prop="condition">
                  <template slot-scope="scope">
                    <div @pointerdown.stop>
                      <el-input v-if="scope.row.type==='IN'||scope.row.type==='NOT IN'"
                                v-model="scope.row.textVal"
                                type="textarea"
                                size="small"
                                placeholder="多选换行"></el-input>
                      <el-input v-if="scope.row.type==='operator'"
                                v-model="scope.row.operatorVal"
                                class="input-with-select">
                        <el-select v-model="scope.row.operator" slot="prepend" placeholder="">
                          <el-option label=">" value=">"></el-option>
                          <el-option label=">=" value=">="></el-option>
                          <el-option label="<" value="<"></el-option>
                          <el-option label="<=" value="<="></el-option>
                          <el-option label="=" value="="></el-option>
                          <el-option label="<>" value="<>"></el-option>
                          <el-option label="IS NULL" value="IS NULL --"></el-option>
                          <el-option label="IS NOT NULL" value="IS NOT NULL --"></el-option>
                          <el-option label="LIKE" value="LIKE"></el-option>
                          <el-option label="RLIKE" value="RLIKE"></el-option>
                        </el-select>
                      </el-input>
                      <el-input v-if="scope.row.type==='between'"
                                v-model="scope.row.fromVal"
                                size="small"
                                placeholder="from"
                                style="margin-bottom: 5px"></el-input>
                      <el-input v-if="scope.row.type==='between'"
                                v-model="scope.row.toVal"
                                size="small"
                                placeholder="to"></el-input>
                      <el-date-picker v-if="scope.row.type==='date'"
                                      v-model="scope.row.dateVal"
                                      type="datetimerange"
                                      size="small"
                                      range-separator="至"
                                      start-placeholder="开始日期"
                                      end-placeholder="结束日期"
                                      :default-time="['06:00:00', '06:00:00']"></el-date-picker>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-collapse-transition>

        </el-card>
      </div>
    `,
    data() {
      return {
        isExpanded: true,
        showSqltext: false,
        id: 0,
        selected: [],
        tableName: '',
        tableData: [],
        options: [
          { value: 'IN', label: '多选' },
          { value: 'NOT IN', label: '反选' },
          { value: 'operator', label: '运算符' },
          { value: 'between', label: '范围' },
          { value: 'date', label: '日期' }
        ]
      }
    },
    computed: {
      tableList() {
        return this.tables.map((item) => {
          return { value: item.tableName }
        })
      },
      downloadable() {
        if (this.tableData.filter((row) => {
            return row.column !== undefined
                && row.column !== ''
          }).length > 10) {
          return false
        }else {
          return this.tableData.filter((row) => {
            return row.type === 'date'
                && row.dateVal !== undefined
                && row.dateVal !== null
          }).filter((row) => {
            return (row.dateVal[1]-row.dateVal[0])/1000/60/60/24 <= 1
          }).length > 0 ? true : false
        }
      }
    },
    created() {
      this.tableName = this.tables.length === 0 ? '' : this.tables[0].tableName
      this.refreshTable()
    },
    mounted() {
      const tbody = this.$el.querySelector('.el-table__body tbody')
      if (tbody) {
        this.tbody = Sortable.create(tbody, {
          animation: 150,
          onEnd: (event) => {
            let temp = this.tableData
            this.tableData = []
            temp.splice(event.newIndex, 0, ...temp.splice(event.oldIndex, 1))
            this.$nextTick(() => {
              this.tableData = temp
            })
          }
        })
      }
    },
    beforeDestroy() {
      this.tbody.destroy()
      this.tbody = null
    },
    methods: {
      collapse() {
        this.isExpanded = !this.isExpanded
      },
      handleSelectionChange(val) {
        this.selected = val.map((row) => {
          return row.id
        })
      },
      querySearch(queryString, cb) {
        let results = queryString ? this.tableList.filter((item) => {
          return item.value.toLowerCase().indexOf(queryString) >= 0
        }) : this.tableList
        cb(results)
      },
      tableChange(val) {
        if (this.tables.findIndex((item) => {
          return item.tableName === val
        }) !== -1) {
          this.refresh()
        }
      },
      tableSelect(obj) {
        this.refresh()
      },
      refreshTable() {
        let table = this.tables.filter((item) => {
          return item.tableName === this.tableName
        })
        this.tableData = table.length === 0 ? [] : table[0].tableColumns.map((item) => {
            return {
              id: this.id++,
              ...item
            }
          })
      },
      refresh() {
        this.$confirm('是否根据当前表名，刷新所有字段？', '提示', {
          type: 'warning'
        }).then((res) => {
          this.refreshTable()
        }).catch((err) => {})
      },
      addRow() {
        this.tableData.push({
          id: this.id++
        })
      },
      deleteRows() {
        this.$confirm('是否删除？', '提示', {
          type: 'warning'
        }).then((res) => {
          this.tableData = this.tableData.filter((row) => {
            return !this.selected.includes(row.id)
          })
          this.selected = []
        }).catch((err) => {})
      },
      query() {
        this.isExpanded = false
        this.$emit('query', this.sqltext$())
      },
      download() {
        if (this.downloadable) {
          this.isExpanded = false
          this.$emit('query', this.sqltextDownload$())
        }else {
          this.$message({
            type: 'warning',
            message: '至少附带一条日期条件，范围不超一日，且查询字段不超十个'
          })
        }
      },
      alias$() {
        return this.tableName.split(' ').length > 1 ? this.tableName.split(' ')[1] + '.' : ''
      },
      columns$() {
        return this.tableData.filter((row) => {
          return row.column !== undefined
              && row.column !== ''
        }).map((row) => {
          let temp = row.alias !== undefined && row.alias !== '' ? ' AS `' + row.alias + '`' : ''
          return '`' + row.column + '`' + temp
        }).join(',\n  ')
      },
      map$() {
        return this.tableData.filter((row) => {
          return row.column !== undefined
              && row.column !== ''
        }).filter((row) => {
          switch(row.type) {
            case 'IN':
            case 'NOT IN':
                return row.textVal !== undefined
                    && row.textVal !== ''
              break
            case 'operator':
                return row.operator !== undefined
              break
            case 'between':
                return row.fromVal !== undefined
                    && row.fromVal !== ''
                    && row.toVal   !== undefined
                    && row.toVal   !== ''
              break
            case 'date':
                return row.dateVal !== undefined
                    && row.dateVal !== null
              break
          }
        }).map((row) => {
          let value
          let startTime
          let endTime
          switch(row.type) {
            case 'IN':
                value = row.textVal.replace(/\n/g, '", "')
                return '`' + row.column + '`' + ' IN ' + '("' + value + '")'
              break
            case 'NOT IN':
                value = row.textVal.replace(/\n/g, '", "')
                return '`' + row.column + '`' + ' NOT IN ' + '("' + value + '")'
              break
            case 'operator':
                value = row.operatorVal === undefined ? '' : ' "' + row.operatorVal + '"'
                return '`' + row.column + '` ' + row.operator + value 
              break
            case 'between':
                return '`' + row.column + '`' + ' BETWEEN "' + row.fromVal + '" AND "' + row.toVal + '"'
              break
            case 'date':
                startTime = moment(row.dateVal[0]).format('YYYY-MM-DD HH:mm:ss')
                endTime = moment(row.dateVal[1]).format('YYYY-MM-DD HH:mm:ss')
                return '`' + row.column + '`' + ' BETWEEN "' + startTime + '" AND "' + endTime + '"'
              break
          }
        }).join('\n  AND ')
      },
      sqltext$() {
        let $select = 'SELECT \n  ' + this.columns$() + '\n'
        let $from = 'FROM ' + this.tableName.split(' ')[0] + '\n'
        let $where = this.map$()
        $where = $where === '' ? '' : 'WHERE ' + $where
        return this.sqltext + '\n' + $select + $from + $where
      },
      strColumns$() {
        return '`' + this.tableData.filter((row) => {
          return row.column !== undefined
              && row.column !== ''
        }).map((row) => {
          return row.column
        }).join('`, `') + '`'
      },
      sqltextDownload$() {
        return `
          ${this.sqltext}
          --@header ${this.strColumns$()}
          SELECT COLLECT_LIST(ttt__.download) AS download__
          FROM (
              SELECT ARRAY(${this.strColumns$()}) AS download
              FROM ${this.tableName}
              WHERE ${this.map$()}
          ) ttt__`
      }
    }
  })


  const pageSearch = Vue.component('page-search', {
    props: {
      title: String,
      sqltext: String,
      tables: Array
    },
    template: `
      <div>
        <view-query-condition-card  :title="title"
                                    :sqltext="sqltext"
                                    :tables="tables"
                                    @query="query"></view-query-condition-card>
        <view-query-result-tabs :tabs="tabs"
                                :new-tab-name="newTabName"
                                @removeTab="handleRemoveTab"></view-query-result-tabs>
      </div>
    `,
    data() {
      return {
        index: 1,
        tabs: [],
        newTabName: ''
      }
    },
    methods: {
      query(sqltext) {
        this.newTabName = 'result_' + this.index++
        this.tabs.push({
          label: this.newTabName,
          name: this.newTabName,
          sqltext: sqltext
        })
      },
      handleRemoveTab(tabName) {
        this.$confirm('是否删除？', '提示', {
          type: 'warning'
        }).then(() => {
          let index = this.tabs.findIndex((item) => {
            return item.name === tabName
          })
          let nextTab = this.tabs[index + 1] || this.tabs[index - 1]
          if (nextTab) {
            this.newTabName = nextTab.name
          }
          this.tabs.splice(index, 1)
        }).catch((err) => {
          // ...
        })
      }
    }
  })





  const pageOption = Vue.component('page-option', {
    template: `
      <div class="page-option">
        <el-card class="box-card">
          <div  slot="header"
                class="clearfix"
                ref="header"
                @click="collapse">
            <span style="font-size:14px; font-weight:bold; color: #737379;">脚本参数</span>
            <el-button  @click.stop="save"
                        style="float: right; padding: 3px 0; font-weight:bold;"
                        type="text">保存</el-button>
          </div>
          <el-collapse-transition>
            <div v-show="isExpanded">
              <comp-code-editor ref="editor"
                                :text="text"
                                mode="text/javascript"
                                theme="base16-dark"
                                @updated="updated"></comp-code-editor>
            </div>
          </el-collapse-transition>
        </el-card>
      </div>
    `,
    data() {
      return {
        key: 'tampermonkey',
        text: '',
        isExpanded: true
      }
    },
    created() {
      try {
        this.text = localStorage.getItem(this.key)
      }catch(error) {
        // console.error(error)
      }
    },
    methods: {
      collapse() {
        this.isExpanded = !this.isExpanded
      },
      resize() {
        this.$refs.editor.codeMirror.setOption('lineNumbers', false)
      },
      updated(text) {
        this.text = text
      },
      save() {
        this.$confirm('是否保存并刷新页面？', '提示', {
          type: 'warning'
        }).then(() => {
          localStorage.setItem(this.key, this.text)
          location.reload()
        }).catch((err) => {
          // ...
        })
      }
    }
  })


  Vue.component('view-chart-table', {
    props: {
      data: Object,
      state: Object
    },
    template: `
      <div style="width: 100%; height: 100%;">
        <el-row>
          <api-temp-query ref="apiTempQuery"
                          :sqltext="sqltext"
                          @completed="handleCompleted"
                          @error="handleError"></api-temp-query>
          <el-input v-show="editable"
                    v-model="data.tableHeight"
                    size="small"
                    placeholder="表格高度"></el-input>
          <div v-show="editable" style="margin: 10px 0;"></div>
          <el-input v-show="editable"
                    v-model="data.chartHeight"
                    size="small"
                    placeholder="图表高度"></el-input>
          <div v-show="editable" style="margin: 10px 0;"></div>
          

          <div v-if="editable">
            <div style="text-align:right">
              <el-link type="info" href="https://help.aliyun.com/zh/dataphin/user-guide/dql-operation?spm=a2c4g.11186623.0.0.3ac45bbcf3wOsd">DQL - Dataphin</el-link>
            </div>
            <comp-code-editor ref="sqlEditor"
                              :text="data.sqltext"
                              mode="text/x-sql"
                              theme="base16-light"
                              @updated="handleSqlUpdated"></comp-code-editor>
          </div>

          <div v-if="editable" style="text-align:right">
            <el-button type="text" @click="()=>data.showTable=!data.showTable">
              <span :class="{'el-primary': data.showTable, 'el-danger': !data.showTable}">Table</span>
            </el-button>
          </div>
          <el-collapse-transition>
            <div v-show="data.showTable">
              <comp-handsontable v-if="data.showTable" 
                                  :result="result" 
                                  :height="data.tableHeight"
                                  :downloadable="editable"></comp-handsontable>
              <div v-show="editable" style="margin: 10px 0;"></div>
            </div>
          </el-collapse-transition>

          <div v-if="editable">
            <div style="text-align:right">
              <el-link type="info" href="https://echarts.apache.org/examples/zh/index.html">Examples - Apache ECharts</el-link>
            </div>
            <comp-code-editor ref="jsEditor"
                              :text="data.jstext"
                              mode="text/javascript"
                              theme="base16-dark"
                              @updated="handleJsUpdated"></comp-code-editor>
          </div>

          <div v-if="editable" style="text-align:right">
            <el-button type="text" @click="()=>data.showChart=!data.showChart">
              <span :class="{'el-primary': data.showChart, 'el-danger': !data.showChart}">Chart</span>
            </el-button>
          </div>
          <el-collapse-transition>
            <div v-show="data.showChart">
              <comp-chart ref="chart"
                          v-if="data.showChart"
                          :option="option"
                          :style="style"></comp-chart>
              <div v-show="editable" style="margin: 10px 0;"></div>
            </div>
          </el-collapse-transition>

        </el-row>
      </div>
    `,
    data() {
      return {
        result: [[]],
        sqlChanged: false
      }
    },
    created() {
      if (this.data.sqltext === undefined) {
        this.$set(this.data, 'sqltext', '')
      }
      if (this.data.jstext === undefined) {
        this.$set(this.data, 'jstext', '')
      }
      if (this.data.chartHeight === undefined) {
        this.$set(this.data, 'chartHeight', '')
      }
      if (this.data.tableHeight === undefined) {
        this.$set(this.data, 'tableHeight', '')
      }
      if (this.data.showChart === undefined) {
        this.$set(this.data, 'showChart', false)
      }
      if (this.data.showTable === undefined) {
        this.$set(this.data, 'showTable', false)
      }
    },
    mounted() {
      this.query()
    },
    computed: {
      editable() {
        return this.$store.state.params.editable
      },
      style() {
        return {
          width: '100%',
          height: this.data.chartHeight === '' ? '600px' : this.data.chartHeight + 'px'
        }
      },
      sqltext() {
        return this.data.sqltext === ''
                  ? ''
                  : this.state.sqltext + '\n' + this.data.sqltext
      },
      option() {
        let option = {}
        let height = this.data.chartHeight
        let result = this.result
        try {
          eval(this.data.jstext)
        } catch(error) {
          console.error(error)
        }
        return option
      }
    },
    watch: {
      editable() {
        if (!this.editable && this.sqlChanged) {
          this.query()
        }
      }
    },
    methods: {
      query() {
        this.sqlChanged = false
        this.$refs.apiTempQuery.start()
      },
      handleSqlUpdated(data) {
        this.sqlChanged = true
        this.data.sqltext = data
      },
      handleJsUpdated(data) {
        this.data.jstext = data
      },
      handleCompleted(result) {
        this.result = result
      },
      handleError(error) {
        this.$message({
          message: error,
          type: 'error'
        })
      }
    }
  })


  Vue.component('view-layout', {
    props: {
      data: Object
    },
    template: `
      <div class="view-layout">
        <el-row :gutter="10">
          <el-col v-for="(item, index) in data.items"
                  :key="item.index"
                  :span="item.layout.span">
            <el-tag v-show="editable"
                    @close="remove(item.index)"
                    type="info"
                    closable
                    style="width: 100%;margin: 10px 0;text-align: right"></el-tag>
            <div @pointerdown.stop>
              <el-input v-show="editable"
                        v-model="item.layout.span"
                        @input="()=>$store.commit('refresh')"
                        size="small"
                        placeholder="宽度"></el-input>
              <div v-show="editable" style="margin: 10px 0;"></div>
              <slot :data="item.data"></slot>
              <div style="margin: 10px 0;"></div>
            </div>
          </el-col>
        </el-row>
        <div v-show="editable" style="text-align: center; margin:10px 0">
          <el-button circle @click="add"><i class="el-icon-circle-plus el-primary"></i></el-button>
        </div>
      </div>
    `,
    created() {
      if (this.data.items === undefined) {
        this.$set(this.data, 'index', 0 )
        this.$set(this.data, 'items', [])
        this.$set(this.data, 'order', [])
      }else {
        this.data.items = this.data.order.map((index) => {
          return {
            ...this.data.items.filter((item) => {
              return item.index === index
            })[0]
          }
        })
      }
    },
    computed: {
      editable() {
        return this.$store.state.params.editable
      }
    },
    methods: {
      add() {
        let index = this.data.index++
        this.data.items.push({
          index: index,
          layout: {
            span: '24'
          },
          data: {}
        })
        this.data.order.push(index)
      },
      remove(index) {
        this.$confirm('是否删除？', '提示', {
          type: 'warning'
        }).then(() => {
          this.data.items.splice(this.data.items.findIndex((item) => {
            return item.index === index
          }), 1)
          this.data.order.splice(this.data.order.findIndex((item) => {
            return item === index
          }), 1)
        })
      }
    },
    mounted() {
      const row = this.$el.querySelector('.view-layout .el-row')
      if (row) {
        this.row = Sortable.create(row, {
          animation: 150,
          onEnd: (event) => {
            this.data.order.splice(event.newIndex, 0, ...this.data.order.splice(event.oldIndex, 1))
          }
        })
      }
    },
    beforeDestroy() {
      this.row.destroy()
      this.row = null
    }
  })


  Vue.component('view-card', {
    props: {
      data: Object
    },
    template: `
      <el-card style="width:100%; height:100%">
        <template v-slot:header>
          <div  class="clearfix"
                @click="collapse">
            <div v-if="editable" @click.stop>
              <el-input v-model="data.card.title"
                        size="small"
                        placeholder="标题"></el-input>
            </div>
            <div v-else>
              <span v-if="data.card.title!==undefined"
                    style="font-size:14px; font-weight:bold; color: #737379;">{{ data.card.title }}</span>
              <el-button  v-if="data.card.btnText!==undefined"
                          type="text"
                          style="float: right; padding: 3px 0; font-weight:bold;"
                          @click.stop="click">{{ data.card.btnText }}</el-button>
            </div>
          </div>
        </template>
        <el-collapse-transition>
          <div v-show="data.isExpanded">
            <slot :data="data.data"></slot>
          </div>
        </el-collapse-transition>
      </el-card>
    `,
    created() {
      if (this.data.card === undefined) {
        this.$set(this.data, 'card', {})
      }
      if (this.data.data === undefined) {
        this.$set(this.data, 'data', {})
      }
      if (this.data.isExpanded === undefined) {
        this.$set(this.data, 'isExpanded', true)
      }
    },
    computed: {
      editable() {
        return this.$store.state.params.editable
      }
    },
    methods: {
      collapse() {
        this.data.isExpanded = !this.data.isExpanded
      },
      click() {
        this.$emit('click')
      }
    }
  })


  const pageCharts = Vue.component('page-charts', {
    props: {
      data: Object
    },
    template:`
      <div>
        <el-card v-if="editable">
          <template v-slot:header>
            <div class="clearfix" @click="collapse">
              <span style="font-size:14px; font-weight:bold; color: #737379;">编辑模式</span>
            </div>
          </template>

          <el-collapse-transition>
            <div v-show="data.isExpanded">
              <comp-code-editor ref="jsEditor"
                                :text="text"
                                mode="text/javascript"
                                theme="base16-dark"
                                :readOnly="true"></comp-code-editor>
              <div style="margin: 10px 0;"></div>
              <comp-code-editor ref="sqlEditor"
                                :text="data.sqltext"
                                mode="text/x-sql"
                                theme="base16-light"
                                @updated="updated"></comp-code-editor>
            </div>
          </el-collapse-transition>

        </el-card>

        <view-layout :data="data">
          <template v-slot:default="{data}">
            <view-card :data="data">
              <template v-slot:default="{data}">
                <view-layout :data="data">
                  <template v-slot:default="{data}">
                    <view-chart-table :data="data" :state="state"></view-chart-table>
                  </template>
                </view-layout>
              </template>
            </view-card>
          </template>
        </view-layout>

      </div>
    `,
    data() {
      return {
        state: {
          sqltext: ''
        }
      }
    },
    created() {
      if (this.data.sqltext === undefined) {
        this.$set(this.data, 'sqltext', '')
      }
      if (this.data.isExpanded === undefined) {
        this.$set(this.data, 'isExpanded', false)
      }
      this.state.sqltext = this.data.sqltext
    },
    computed: {
      editable() {
        return this.$store.state.params.editable
      },
      text() {
        return JSON.stringify(this.data, null, null)
      }
    },
    watch: {
      'data.sqltext'() {
        this.state.sqltext = this.data.sqltext
      }
    },
    methods: {
      collapse() {
        this.data.isExpanded = !this.data.isExpanded
      },
      updated(text) {
        this.data.sqltext = text
      }
    }
  })


  // Vue.component('view-window', {
  //   props: {
  //     data: Object
  //   },
  //   template:`
  //     <div>
  //       <div ref="window">
  //         <slot :data="data.data"></slot>
  //       </div>
  //     </div>
  //   `,
  //   created() {
  //     if (this.data.data === undefined) {
  //       this.$set(this.data, 'data', {})
  //     }
  //     if (this.data.style === undefined) {
  //       this.$set(this.data, 'style', '')
  //     } else {
  //       $(this.$refs.window).attr('style', this.data.style)
  //     }
  //   },
  //   mounted() {
  //     const that = this
  //     $(this.$refs.window).resizable({
  //       minWidth: 200,
  //       minHeight: 80,
  //       stop: function( event, ui ) {
  //         that.data.style = $(this).attr('style')
  //       }
  //     })
  //     $(this.$refs.window).draggable({
  //       containment: '.desktop',
  //       scroll: true,
  //       stop: function( event, ui ) {
  //         that.data.style = $(this).attr('style')
  //       }
  //     })
  //   }
  // })


  // const pageTest = Vue.component('page-test', {
  //   props: {
  //     data: Object
  //   },
  //   template:`
  //     <div >

  //       <el-card v-if="editable">
  //         <template v-slot:header>
  //           <div class="clearfix">
  //             <span style="font-size:14px; font-weight:bold; color: #737379;">编辑模式</span>
  //           </div>
  //         </template>
  //         <comp-code-editor ref="jsEditor"
  //                           :text="text"
  //                           mode="text/javascript"
  //                           theme="base16-dark"
  //                           :readOnly="true"></comp-code-editor>
  //       </el-card>

  //       <view-window :data="data" class="desktop" style="background-color:gray">
  //         <template v-slot:default="{data}">

  //               <view-window :data="data" style="position: absolute">
  //                 <template v-slot:default="{data}">
  //                   <view-card :data="data"></view-card>
  //                 </template>
  //               </view-window>

  //         </template>
  //       </view-window>
  //     </div>
  //   `,
  //   computed: {
  //     editable() {
  //       return this.$store.state.params.editable
  //     },
  //     text() {
  //       return JSON.stringify(this.data, null, this.replacer ? 2 : null)
  //     }
  //   }
  // })







  Vue.component('view-submenu', {
    props: {
      index: String,
      groups: Array
    },
    template: `
      <div>
        <div v-for="(item, index) in _groups" :key="index">
          <el-submenu v-if="item.type==='group'"
                      :index="item.index">
            <template slot="title">
              <i v-if="item.icon!==undefined" :class="item.icon"></i><span>{{item.title}}</span>
            </template>
            <view-submenu :groups="item.groups"
                          :index="item.index"></view-submenu>
          </el-submenu>
          <el-menu-item v-else-if="item.type==='page'"
                        :index="item.index">
            <i v-if="item.icon!==undefined" :class="item.icon"></i><span>{{item.title}}</span>
          </el-menu-item>
        </div>
      </div>
    `,
    computed: {
      _groups() {
        return this.groups.map((item, index) => {
          let path = md5(this.index + '_' + index)
          if (item.type === 'page') {
            this.$router.addRoute({
              path: '/' + path,
              component: item.component,
              props: item.props
            })
          }
          return {
            index: path,
            ...item
          }
        }) 
      }
    }
  })


  Vue.component('comp-init', {
    computed: {
      key() {
        return this.$store.state.key
      }
    },
    created() {
      let option = {}
      try {
        eval(localStorage.getItem(this.key))
        this.$store.commit('setParams', option.params)
        this.$store.commit('setGroups', option.groups)
      }catch(error) {
        console.error(error)
      }
      if (option.menus !== undefined) {
        this.getMenu(option.menus, 0)
        // option.menus.forEach((menu) => {
        //   API.resource(menu.params).then((data) => {
        //     option = {}
        //     try {
        //       eval(data.data.content)
        //       this.$store.commit('pushMenus', option)
        //     }catch(error) {
        //       console.error(error)
        //     }
        //   }).catch((error) => {
        //     // ...
        //   })
        // })
      }
    },
    methods: {
      getMenu(menus, index) {
        API.resource(menus[index].params).then((data) => {
          if(data.code === '0') {
            option = {}
            try {
              eval(data.data.content)
              this.$store.commit('pushMenus', option)
            }catch(error) {
              console.error(error)
            }
          }else {
            this.$message({
              message: '订阅加载错误',
              type: 'error'
            })
          }
        }).catch((error) => {
          console.error(error)
        }).finally(() => {
          if (index < menus.length - 1) {
            this.getMenu(menus, index + 1)
          }
        })
      }
    }
  })


  // 创建项目模板
  let template = `
    <div id="app">
      <comp-init></comp-init>

      <el-container style="height: 100%; border: 1px solid #eee">

        <el-aside>
          <el-menu  class="el-menu-vertical-demo"
                    background-color="#545c64"
                    text-color="#fff"
                    active-text-color="#ffd04b"
                    style="height:100%;"
                    router>

            <el-submenu index="search">
              <template slot="title"><i class="el-icon-s-platform"></i><span>查询</span></template>
                <el-menu-item index="tempquery">即席查询</el-menu-item>
            </el-submenu>

            <el-submenu index="subscribe">
              <template slot="title"><i class="el-icon-menu"></i><span>订阅</span></template>
              <view-submenu :groups="menus" :index="'subscribe'"></view-submenu>
            </el-submenu>

            <el-submenu index="develop">
              <template slot="title"><i class="el-icon-s-opportunity"></i><span>开发</span></template>
              <view-submenu :groups="groups" :index="'develop'"></view-submenu>
            </el-submenu>

            <el-submenu index="settings">
              <template slot="title"><i class="el-icon-s-tools"></i><span>设置</span></template>
              <el-menu-item index="option">脚本参数</el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>

        <el-container>
          <el-header style="text-align: right; font-size: 12px; height: 50px; line-height: 48px; border: 1px solid #eee; background-color: #fafafa">
            <el-button v-if="!editable"  @click="editableChange" size="small" icon="el-icon-s-help" round>More</el-button>
            <el-button v-else type="danger" @click="editableChange" size="small" icon="el-icon-s-help" round>More</el-button>
          </el-header>
          <el-main>
            <keep-alive>
              <router-view :key="$route.path"></router-view>
            </keep-alive>
          </el-main>
        </el-container>

      </el-container>

    </div>

  `
  $('body').prepend(template)

  // Vuex
  const store = new Vuex.Store({
    state: {
      // 脚本使用
      index: 0,
      refresh: 0,
      key: 'tampermonkey',
      apiQueue: [],

      // 自定义脚本参数
      params: {
        projectId: '',
        fileId: '',
        lockId: '',
        _: '',
        tableType: 'element-ui',
        editable: false,
        apiModel: 'dev'
      },
      groups:[],
      // 订阅
      menus: []
    },
    mutations: {
      setParams(state, data) {
        state.params = {...state.params, ...data}
      },
      setGroups(state, data) {
        state.groups = [...state.groups, ...data]
      },
      setMenus(state, data) {
        state.menus = [...state.menus, ...data]
      },
      pushMenus(state, data) {
        state.menus.push(data)
      },
      refresh(state) {
        state.refresh++
      },
      editable(state) {
        state.params.editable = !state.params.editable
      }
    }
  })

  // Vue Router
  const routes = [
      { path: '/tempquery', component: pageSqlEditor, props:{ sqltext: 'SELECT' } },
      { path: '/option', component: pageOption }
    ]
  const router = new VueRouter({
    routes
  })
  router.afterEach((to, from) => {
    store.commit('refresh')
  })

  // Vue 根实例
  const app = new Vue({
    store,
    router,
    computed: {
      editable() {
        return this.$store.state.params.editable
      },
      menus() {
        return this.$store.state.menus
      },
      groups() {
        return this.$store.state.groups
      }
    },
    methods: {
      editableChange() {
        this.$store.commit('editable')
      }
    }
  })
  app.$mount('#app')













})();