// ==UserScript==
// @name         EDRI OA
// @namespace    bsn
// @version      1.2
// @description  OA小助手
// @author       不死鸟
// @require      https://unpkg.com/vue@3.5.13/dist/vue.global.prod.js
// @require      data:application/javascript,unsafeWindow.Vue%3DVue%2Cthis.Vue%3DVue%3B
// @require      https://unpkg.com/naive-ui@2.40.3/dist/index.js
// @require      https://unpkg.com/lscache@1.3.2/lscache.js
// @require      https://unpkg.com/moment@2.30.1/moment.js
// @require      https://unpkg.com/moment@2.30.1/locale/zh-cn.js
// @require      https://unpkg.com/html2canvas@1.4.1/dist/html2canvas.js
// @require      https://update.greasyfork.org/scripts/520145/1544039/bsn-libs.js
// @match        https://oac.edri.cn:8085/spa/workflow/static4form/index.html?*
// @grant        unsafeWindow
// @grant        GM_addStyle
// @license      GPL version 3
// @downloadURL https://update.greasyfork.org/scripts/520276/EDRI%20OA.user.js
// @updateURL https://update.greasyfork.org/scripts/520276/EDRI%20OA.meta.js
// ==/UserScript==

(function() {
if (!window.location.href.includes('iscreate=1')) return;
GM_addStyle(``);
window.initVue3({
  template: `
      <n-form label-placement="left" label-width="auto" size="small" :show-feedback="false">
        <n-form-item>
          <n-button type="info" style="width: 100%" @click="fillInvoice">填写开票申请</n-button>
        </n-form-item>
      </n-form>
      `,
  props: {},
  emits: ['closeDrawer'],
  setup(props, { emit }) {
    const message = naive.useMessage();
    const dialog = window.createNaiveDialog();
    const testing = false;
    const data = Vue.reactive({
      contractInvoice: '',
      async fillInvoice() {
        data.contractInvoice = testing
          ? `开票申请资料
  开票信息
  合同编号\t2025-03设-001
  合同名称\txx项目
  项目负责人\t朱圣杰
  本次开票金额\t1000000
  发票内容\t设计费
  发票类型\t专用发票（正数）
  我司开票资料
  开户行\t中国银行成都猛追湾支行
  账号\t125254886708
  客户开票资料
  客户开票名称\txx有限公司
  税号\t1234567890W
  单位地址\txx市xx路xx号
  电话号码\t0510-12345678
  开户银行\t中国银行xx支行
  银行账号\t1234567890
  备注\tPO12345678
  `
          : '';
        let isOk =
          testing ||
          (await dialog.successAsync({
            title: '开票申请资料',
            showIcon: false,
            content: () =>
              Vue.h(naive.NInputGroup, {}, () => [
                Vue.h(naive.NInput, {
                  value: data.contractInvoice,
                  type: 'textarea',
                  placeholder: '请输入开票申请资料',
                  rows: 15,
                  ['onUpdate:value']: v => {
                    data.contractInvoice = v;
                  }
                }),
                Vue.h(
                  naive.NButton,
                  {
                    type: 'info',
                    onclick: async () => (data.contractInvoice = await window.getClipboardText())
                  },
                  () => '粘贴板'
                )
              ]),
            positiveText: '下一步',
            negativeText: '取消'
          }));
        if (!isOk) return;
        const infos = {
          basic: {
            contractNo: { title: '合同编号', value: '' },
            contractName: { title: '合同名称', value: '' },
            projectLeader: { title: '项目负责人', value: '' },
            invoiceAmount: { title: '本次开票金额', includes: true, value: '' },
            invoiceContent: { title: '发票内容', value: '' },
            invoiceType: { title: '发票类型', value: '' }
          },
          company: {
            bankOfDeposit: { title: '开户行', value: '' },
            accounts: { title: '账号', value: '' }
          },
          customer: {
            customerName: { title: '客户开票名称', value: '' },
            dutyParagraph: { title: '税号', value: '' },
            customerAddress: { title: '单位地址', value: '' },
            telephone: { title: '电话号码', value: '' },
            customerbank: { title: '开户银行', value: '' },
            bankAccounts: { title: '银行账号', value: '' },
            remarks: { title: '备注', value: '' }
          }
        };
        const patterns = [];
        Object.keys(infos).forEach(key => {
          const o = infos[key];
          Object.keys(o).forEach(key2 => {
            const o2 = o[key2];
            const matches = new RegExp(`(${o2.title}\\s{0,})\\t(.{0,})`).exec(data.contractInvoice);
            if (matches) {
              const [_, head, content] = matches;
              const v = content.trim();
              o2.value = v;
              patterns.push(head + '\t');
              if (v) patterns.push(v);
            }
          });
        });
        await sleep(300);
        isOk =
          testing ||
          (await dialog.successAsync({
            title: '匹配结果',
            showIcon: false,
            content: () =>
              Vue.h(naive.NScrollbar, { style: 'max-height: calc(100vh - 200px)' }, () =>
                Vue.h(naive.NHighlight, {
                  text: data.contractInvoice,
                  patterns: patterns,
                  style: 'word-break: normal;white-space: pre-wrap'
                })
              ),
            positiveText: '下一步',
            negativeText: '取消'
          }));
        if (!isOk) return;
        emit('closeDrawer');
        const table = window.find({ selectors: 'table' });
        window.simulateOperate([
          {
            type: 'click',
            parent: table,
            selectors: 'td',
            findTarget: els => {
              const el = els.find(x => x.innerText.trim().includes('合同编号'));
              if (!el) return;
              return window.find({ parent: el.nextElementSibling, selectors: 'button' });
            },
            nextSteps: [
              {
                type: 'input',
                selectors: '.ant-modal-body .ant-row',
                waiting: 1000,
                value: infos.basic.contractNo.value,
                findTarget: els => {
                  const el = els.find(
                    x => x.innerText.trim() === '合同编号' && !x.className.includes(' ')
                  );
                  if (!el) return;
                  return window.find({ parent: el.nextElementSibling, selectors: 'input' });
                }
              },
              {
                type: 'click',
                selectors: '.ant-modal-body button',
                findTarget: els => {
                  return els.find(x => x.innerText.trim() === '搜 索');
                }
              },
              {
                type: 'click',
                selectors: '.ant-modal-body .ant-table-body tr',
                waiting: 1500
              }
            ]
          },
          {
            type: 'click',
            parent: table,
            selectors: 'td',
            waiting: 1000,
            findTarget: els => {
              const el = els.find(x => x.innerText.trim().includes('项目负责人'));
              if (!el) return;
              const td = el.nextElementSibling;
              const name = window.find({ parent: td, selectors: 'ul a' })?.innerText?.trim();
              if (!name) return window.find({ parent: td, selectors: 'button' });
              if (name === infos.basic.projectLeader.value) return;
              message.error('项目负责人不一致');
            },
            nextSteps: [
              {
                type: 'input',
                selectors: '.ant-modal-body .wea-search-tab input',
                waiting: 1000,
                value: infos.basic.projectLeader.value
              },
              {
                type: 'click',
                selectors: '.ant-modal-body .wea-search-tab button'
              },
              {
                type: 'click',
                selectors: '.ant-modal-body .wea-crm-list li',
                waiting: 1500,
                findTarget: els => {
                  return els.find(x => x.innerText.includes('华东分院')) || els[0];
                }
              }
            ]
          },
          {
            type: 'click',
            selectors: 'td',
            waiting: 500,
            findTarget: els => {
              const el = els.find(x => x.innerText.trim() === '发票类型');
              if (!el) return;
              return window.find({ parent: el.nextElementSibling, selectors: '.ant-select' });
            }
          },
          {
            type: 'click',
            selectors: '.ant-select-dropdown-menu-item',
            waiting: 500,
            findTarget: els => {
              return els.find(x => x.innerText.trim() === infos.basic.invoiceType.value);
            }
          },
          {
            type: 'click',
            selectors: 'td .ant-radio-wrapper',
            findTarget: els => {
              return els.find(x => x.innerText.trim() === 'PDF文件');
            }
          },
          ...[
            infos.basic.invoiceAmount,
            infos.basic.invoiceContent,
            infos.company.bankOfDeposit,
            infos.company.accounts,
            infos.customer.customerName,
            infos.customer.dutyParagraph,
            infos.customer.customerAddress,
            infos.customer.telephone,
            infos.customer.customerbank,
            infos.customer.bankAccounts,
            infos.customer.remarks
          ].map(x => ({
            type: 'input',
            selectors: 'td',
            value: x.value,
            focusable: true,
            findTarget: els => {
              const key = x.key || x.title;
              const el = els.find(y => {
                const txt = y.innerText.trim();
                return (x.includes && txt.includes(key)) || (!x.includes && txt === key);
              });
              if (!el) return;
              return window.find({ parent: el.nextElementSibling, selectors: 'input, textarea' });
            }
          }))
        ]);
      }
    });
    return data;
  }
});
})();