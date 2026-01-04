// ==UserScript==
// @name         ECNUPrettier
// @namespace    http://santonin.top/
// @version      1.1.1
// @description  Make ECNU Website Great Again !
// @author       Santonin
// @match        https://applicationnewjw.ecnu.edu.cn/eams/home.action*
// @match        https://applicationnewjw.ecnu.edu.cn/eams/myPlanCompl.action*
// @require      https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js
// @require      https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      GPL-3.0-or-later; https://www.gnu.org/licenses/gpl-3.0.txt
// @downloadURL https://update.greasyfork.org/scripts/536396/ECNUPrettier.user.js
// @updateURL https://update.greasyfork.org/scripts/536396/ECNUPrettier.meta.js
// ==/UserScript==

let tableData = [];

/** 重新累加计算每个非叶子节点的 leafNum */
function accLeafNum(result) {
  function computeLeafNum(node) {
    if (!node.children) return;
    if (node.isLeaf) {
      if (!node.isFold) node.leafNum = node.children.length;
      else node.leafNum = 1;
      return;
    }
    node.leafNum = 0;
    for (const child of node.children) {
      computeLeafNum(child);
      node.leafNum += child.leafNum || 1;
    }
  }

  for (const node of result) {
    computeLeafNum(node);
  }
  return result;
}

/** 表格数据整型 */
function foldItems(items) {
  const result = [];
  let lastKind1 = null;
  let lastKind2 = null;

  // 第一步：构建树结构
  for (const item of items) {
    if (item.kind === 1) {
      result.push(item);
      lastKind1 = item;
      lastKind2 = null;
    } else if (item.kind === 2) {
      if (lastKind1) {
        lastKind1.children.push(item);
        lastKind2 = item;
      }
    } else if (item.kind === 3) {
      if (lastKind2) {
        lastKind2.children.push(item);
      }
    }
  }

  // 第二步：补全空 children（加一个 null 子节点）
  function ensureNonEmptyChildren(node) {
    if (!node.children) return;
    if (node.children.length === 0) {
      node.children = [{ isFake: true }];
      node.isLeaf = true;
      node.isFold = false;
    } else {
      if (node.children[0].kind === undefined) {
        node.isLeaf = true;
        node.isFold = false;
      } else {
        node.isLeaf = false;
      }
      for (const child of node.children) {
        if (child) ensureNonEmptyChildren(child);
      }
    }
  }

  for (const node of result) {
    ensureNonEmptyChildren(node);
  }

  // 第三步：自底向上累加 leafNum
  return accLeafNum(result);
}

/** 表格渲染函数 */
function renderTable(data, isExportMode = false) {
  const $table = $('<table>').css({
    width: '100%',
    borderCollapse: 'collapse',
    margin: '10px 0px',
    border: '1px solid #ccc',
    lineHeight: '20px',
    fontSize: '14px',
  });

  const thStyle = { border: '1px solid #ccc', padding: '4px 8px' };
  const tdStyle = { border: '1px solid #ccc', padding: '4px 8px' };

  const $thead = $('<thead>').append(
    $('<tr>')
      .css({ backgroundColor: '#F6F6F6' })
      .append(
        $('<th>').text('1').css(thStyle).css({ width: '11%' }),
        $('<th>').text('2').css(thStyle).css({ width: '9%' }),
        $('<th>').text('3').css(thStyle).css({ width: '22%' }),
        $('<th>').text('代码').css(thStyle).css({ width: '13%' }),
        $('<th>').text('名称').css(thStyle).css({ width: '24%' }),
        $('<th>').text('学分').css(thStyle).css({ width: '4%' }),
        $('<th>').text('成绩').css(thStyle).css({ width: '5%' }),
        $('<th>').text('通过否').css(thStyle).css({ width: '6%' }),
        $('<th>').text('备注').css(thStyle).css({ width: '6%' })
      )
  );

  const $tbody = $('<tbody>');

  function renderCreditUI({ finishedCredit, credit }) {
    const colors = [
      ['#E3FCD1', '#55CB00'],
      ['#D1EFFC', '#0C92CD'],
      ['#FEE6E3', '#F1604D'],
    ];
    const colorFlag = finishedCredit - credit >= 0 ? 0 : 2;
    return $('<div>')
      .css({
        borderRadius: '999px',
        background: colors[colorFlag][0],
        color: colors[colorFlag][1],
        fontWeight: 600,
        padding: '2px 8px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      })
      .append(
        $('<p>')
          .css({ margin: 0, fontSize: '12px', whiteSpace: 'nowrap' })
          .text(`${finishedCredit} / ${credit}`)
      );
  }

  function renderKind(data) {
    const content = $('<div>')
      .css({
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
      })
      .append($('<p>').css({ margin: 0, fontSize: '14px' }).text(data.name))
      .append(renderCreditUI(data));
    return $('<div>')
      .css({
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      })
      .append(content);
  }

  function renderLeafHeader(data) {
    const content = $('<div>')
      .css({
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: '8px',
      })
      .append($('<p>').css({ margin: 0, fontSize: '14px' }).text(data.name))
      .append(renderCreditUI(data));

    const res = $('<div>');
    res.css({
      width: '100%',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    });

    const btn = $('<button>');
    btn.text(data.isFold ? '展开' : '收纳');
    btn.css({
      border: 'none',
      cursor: 'pointer',
      height: '24px',
    });
    btn.click(() => {
      data.isFold = !data.isFold;
      rerender();
    });
    if (isExportMode) return res.append(content);
    else return res.append(content).append(btn);
  }

  function renderHeader(kind, isLeaf = false) {
    if (isLeaf)
      return $('<td>')
        .html(renderLeafHeader(kind))
        .css(tdStyle)
        .attr('rowspan', kind.leafNum);
    else
      return $('<td>')
        .html(renderKind(kind))
        .css(tdStyle)
        .attr('rowspan', kind.leafNum);
  }

  function renderFakeChild(row, child) {
    const isFake = Boolean(child.children[0].isFake);
    $tbody.append(
      row.append(
        $('<td>')
          .html(`${isFake ? 0 : child.children.length} 门课程`)
          .css({ ...tdStyle, textAlign: 'center' })
          .attr('colspan', 6)
      )
    );
  }

  function renderTd(row, item) {
    const {
      courseSequence,
      courseCode,
      courseName,
      credit,
      finishedCredit,
      score,
      isPass,
      remark,
    } = item;

    $tbody.append(
      row.append(
        $('<td>')
          .css(tdStyle)
          .html(courseCode ?? ''),
        $('<td>')
          .css({
            ...tdStyle,
            color: isPass === '是' ? '' : 'red',
          })
          .html(courseName ?? ''),
        $('<td>')
          .css(tdStyle)
          .html(credit ?? ''),
        $('<td>')
          .css(tdStyle)
          .html(score ?? ''),
        $('<td>')
          .css(tdStyle)
          .html(isPass ?? ''),
        $('<td>')
          .css(tdStyle)
          .html(remark ?? '')
      )
    );
  }

  function addRows(items, $tbody) {
    items.forEach((kind1, index1) => {
      kind1.children.forEach((kind2, index2) => {
        if (kind2.children.length && kind2.children[0].kind === 3) {
          // 有 kind3
          kind2.children.forEach((kind3, index3) => {
            if (kind3.isFold) {
              let row = $('<tr>');
              if (index2 === 0) {
                row.append(renderHeader(kind1));
              }
              if (index3 === 0) {
                row.append(renderHeader(kind2));
              }
              row.append(renderHeader(kind3, true));

              // const isFake = Boolean(kind3.children[0].isFake);
              // $tbody.append(
              //   row.append(
              //     $('<td>')
              //       .html(`${isFake ? 0 : kind3.children.length}门课程`)
              //       .css(tdStyle)
              //       .attr('colspan', 6)
              //   )
              // );
              renderFakeChild(row, kind3);
            } else
              kind3.children.forEach((item, index4) => {
                let row = $('<tr>');
                if (index4 === 0) {
                  if (index2 === 0) {
                    row.append(renderHeader(kind1));
                  }
                  if (index3 === 0) {
                    row.append(renderHeader(kind2));
                  }
                  row.append(renderHeader(kind3, true));
                }
                renderTd(row, item);
              });
          });
        } else {
          // 没有 kind3
          if (kind2.isFold) {
            let row = $('<tr>');
            if (index2 === 0) {
              // 如果这是渲染 kind1 的第一行，需要额外渲染左侧表头
              row.append(renderHeader(kind1));
            }
            // 如果这是渲染 kind2 的第一行，需要额外渲染左侧表头
            row.append(renderHeader(kind2, true).attr('colspan', 2));

            // const isFake = Boolean(kind2.children[0].isFake);
            // $tbody.append(
            //   row.append(
            //     $('<td>')
            //       .html(`${isFake ? 0 : kind2.children.length}门课程`)
            //       .css(tdStyle)
            //       .attr('colspan', 6)
            //   )
            // );
            renderFakeChild(row, kind2);
          } else
            kind2.children.forEach((item, index3) => {
              let row = $('<tr>');
              if (index3 === 0) {
                if (index2 === 0) {
                  row.append(renderHeader(kind1));
                }
                row.append(renderHeader(kind2, true).attr('colspan', 2));
              }
              renderTd(row, item);
            });
        }
      });
    });
  }

  addRows(data, $tbody);

  $table.append($thead).append($tbody);

  return $('<div>')
    .css({
      width: '100%',
      maxHeight: '100%',
      overflowY: 'auto',
    })
    .attr('id', 'pretty-table-container')
    .append($table);
}

let $modal = null;
let $overlay = null;
/** 重渲染弹窗内的表格和关闭按钮 */
function rerender() {
  tableData = accLeafNum(tableData);
  console.log(tableData);

  // 记录当前滚动高度，并清空表格的容器
  const tableContainer = $('#pretty-table-container');
  const scrollTop = $('#pretty-table-container').scrollTop();
  tableContainer.empty();

  // 重新渲染表格，并滚动至原位置
  tableContainer.append(renderTable(tableData));
  tableContainer.scrollTop(scrollTop);
}

/** 关闭弹窗事件 */
function closeModal() {
  if ($overlay) {
    $overlay.remove();
    $('body > *:not(#custom-overlay)').css('filter', 'none');
  }
}

function goThroughLeaf(node, fn) {
  if (!node.children) return;
  if (node.isLeaf) {
    fn(node);
  } else {
    for (const child of node.children) {
      goThroughLeaf(child, fn);
    }
  }
}

/** 全部展开事件 */
function allUnfold() {
  for (const node of tableData) {
    goThroughLeaf(node, (node) => {
      node.isFold = false;
    });
  }
  rerender();
}
/** 全部收纳事件 */
function allFold() {
  for (const node of tableData) {
    goThroughLeaf(node, (node) => {
      node.isFold = true;
    });
  }
  rerender();
}

/** 展示表格弹窗 */
function showOverlayWithTable(tableData) {
  // 模糊背景
  $('body > *:not(#custom-overlay)').css('filter', 'blur(4px)');

  // 遮罩层
  $overlay = $('<div id="custom-overlay">').css({
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.3)',
    zIndex: 9999,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  });

  // 弹窗容器
  $modal = $('<div>').css({
    background: '#fff',
    padding: '40px 20px 20px',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0,0,0,0.3)',
    height: '90vh',
    width: '1200px',
    minWidth: '800px',
    position: 'relative',
  });

  // 关闭按钮
  const $closeBtn = $('<button>关闭</button>');
  $closeBtn.css({
    position: 'absolute',
    top: '12px',
    right: '12px',
    cursor: 'pointer',
  });
  $closeBtn.click(closeModal);

  // 全部展开
  const $allUnfold = $('<button>全部展开</button>');
  $allUnfold.css({
    position: 'absolute',
    top: '12px',
    left: '12px',
    cursor: 'pointer',
  });
  $allUnfold.click(allUnfold);

  // 全部收纳
  const $allFold = $('<button>全部收纳</button>');
  $allFold.css({
    position: 'absolute',
    top: '12px',
    left: '96px',
    cursor: 'pointer',
  });
  $allFold.click(allFold);

  // 导出图片
  const $exportIMG = $('<button>导出图片</button>');
  $exportIMG.css({
    position: 'absolute',
    top: '12px',
    left: '180px',
    cursor: 'pointer',
  });
  $exportIMG.click(exportToImage);

  // 导出pdf
  const $exportExcel = $('<button>导出Excel</button>');
  $exportExcel.css({
    position: 'absolute',
    top: '12px',
    left: '264px',
    cursor: 'pointer',
  });
  $exportExcel.click(exportToExcel);

  $modal
    .append($closeBtn)
    .append($allUnfold)
    .append($allFold)
    .append($exportIMG)
    .append($exportExcel)
    .append(renderTable(tableData));

  $overlay.append($modal);
  $('body').append($overlay);
}

const kindOne = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
const kindTwo = [
  '(一)',
  '(二)',
  '(三)',
  '(四)',
  '(五)',
  '(六)',
  '(七)',
  '(八)',
  '(九)',
  '(十)',
];

function mainPrettier() {
  const $chartView = $('#chartView');
  if ($chartView) {
    $('#chartView table tbody tr').each(function () {
      // 读取表格行
      const rowData = [];
      $(this)
        .find('td')
        .each(function () {
          rowData.push($(this).text().trim());
        });
      // 整型数据
      if (rowData.length === 8) {
        // 是具体的课程条目
        if (tableData.length) {
          const last = tableData.at(-1);
          last.leafNum++;
          last.children.push({
            courseSequence: rowData[0],
            courseCode: rowData[1],
            courseName: rowData[2],
            credit: rowData[3],
            finishedCredit: rowData[4],
            score: rowData[5],
            isPass: rowData[6],
            remark: rowData[7],
          });
        }
      } else if (rowData.length === 6) {
        // 是课程所属门类
        let kind = 0;
        if (kindOne.some((prefix) => rowData[0].startsWith(prefix))) {
          kind = 1;
        } else if (kindTwo.some((prefix) => rowData[0].startsWith(prefix))) {
          kind = 2;
        } else {
          kind = 3;
        }

        if (kind !== 0) {
          tableData.push({
            kind: kind,
            leafNum: 0,
            name: rowData[0].replace('(所有子项均应满足要求)', ''),
            credit: rowData[1],
            finishedCredit: rowData[2],
            children: [],
          });
        }
      } else {
        console.error('未知的表格行！ Unknown table row !');
      }
    });

    tableData = foldItems(tableData);
    console.log(tableData);

    showOverlayWithTable(tableData);
    return true;
  } else {
    return false;
  }
}

/**
 * 根据当前时间和文件类型生成唯一的文件名
 * @param {string} fileType - 文件类型，'excel' | 'image'
 * @returns {string} 生成的文件名，格式为：[前缀]_[YYYYMMDD_HHMMSS].[扩展名]
 */
function generateFilename(fileType) {
  // 获取当前时间
  const now = new Date();

  // 格式化日期时间为 YYYYMMDD_HHMMSS
  const formattedDateTime = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0'),
    '_',
    String(now.getHours()).padStart(2, '0'),
    String(now.getMinutes()).padStart(2, '0'),
    String(now.getSeconds()).padStart(2, '0'),
  ].join('');

  // 定义文件类型映射表
  const fileTypeMap = {
    excel: { extension: 'xlsx' },
    image: { extension: 'png' },
  };

  // 获取文件类型配置，默认为csv
  const { extension } = fileTypeMap[fileType] || fileTypeMap.csv;

  // 返回生成的文件名
  return `计划完成情况_${formattedDateTime}.${extension}`;
}

// 导出为图片
function exportToImage() {
  // 创建临时容器
  const tempContainer = $('<div>');
  tempContainer.css({
    position: 'fixed',
    top: '-9999px',
    left: '-9999px',
    width: 'auto',
    padding: '20px',
    backgroundColor: 'white',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    borderRadius: '8px',
  });

  // 克隆表格并添加到临时容器
  const clonedTable = renderTable(tableData, true);
  tempContainer.append(clonedTable);
  $('body').append(tempContainer);

  // 使用html2canvas渲染表格为图片
  html2canvas(clonedTable[0], {
    scale: 2,
    useCORS: true,
    logging: false,
  }).then((canvas) => {
    // 转换为图片URL并下载
    const imgData = canvas.toDataURL('image/png');
    const test = 'test';
    const $link = $('<a>').attr({
      download: generateFilename('image'),
      href: imgData,
    });
    $link[0].click();

    // 移除临时容器
    tempContainer.remove();
  });
}

// 导出为Excel
function exportToExcel() {
  const table = renderTable(tableData, true);
  const wb = XLSX.utils.table_to_book(table[0], { sheet: 'Sheet1' });
  XLSX.writeFile(wb, generateFilename('excel'));
}

// 下载文件
function downloadFile(content, filename, contentType) {
  const a = document.createElement('a');
  const file = new Blob([content], { type: contentType });
  a.href = URL.createObjectURL(file);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}

(function () {
  ('use strict');

  $(document).ready(function () {
    console.log("I'm Santonin");
    const myBtn = $('<div>');
    myBtn.text('Prettified Table').css({
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      boxShadow: '4px 4px 12px rgba(0, 0, 0, 0.2)',
      borderRadius: '999px',
      height: '40px',
      padding: '0px 12px',
      backgroundColor: 'white',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      userSelect: 'none',
      cursor: 'pointer',
    });
    myBtn.click(() => {
      if (tableData.length) {
        showOverlayWithTable(tableData);
        return;
      }
      const res = mainPrettier();
      if (!res) {
        console.log('当前页面没有chartView');
      }
    });
    $('body').append(myBtn);
  });
})();
