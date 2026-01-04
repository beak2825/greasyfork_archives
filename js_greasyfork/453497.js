// ==UserScript==
// @name        OJCN Report Gen
// @description 自动生成作业报告 (docx)。虽然大家并不想理我。
// @namespace   https://greasyfork.org/users/197529
// @version     0.2.16
// @author      kkocdko
// @license     Unlicense
// @match       *://noi.openjudge.cn/*
// @downloadURL https://update.greasyfork.org/scripts/453497/OJCN%20Report%20Gen.user.js
// @updateURL https://update.greasyfork.org/scripts/453497/OJCN%20Report%20Gen.meta.js
// ==/UserScript==
"use strict";

const cfg = {
  studentName: "无名氏", // 姓名
  homeworkId: 4, // 作业序号
  userId: document.querySelector("#userToolbar>li")?.textContent,
};
cfg.problems = {
  // 9: [
  //   "ch0107/01",
  //   "ch0107/03",
  // ],
  8: [
    "ch0110/05",
    "ch0110/09",
    "ch0112/10",
    "ch0113/14",
    "ch0107/22",
    "ch0107/26",
    // https://leetcode.cn/problems/string-to-integer-atoi/
    // https://leetcode.cn/problems/valid-palindrome/
    // https://leetcode.cn/problems/ugly-number/
    // https://leetcode.cn/problems/power-of-two/
  ],
  7: [
    "ch0107/19",
    "ch0107/20",
    "ch0107/21",
    "ch0107/23",
    "ch0107/25",
    // just them
  ],
  6: [
    "ch0107/01",
    "ch0107/03",
    "ch0107/05",
    "ch0107/08",
    "ch0107/09",
    "ch0107/10",
    "ch0107/12",
    "ch0107/17",
    "ch0107/33",
    "ch0109/11",
  ],
  5: [
    "ch0105/15",
    "ch0105/22",
    "ch0105/35",
    "ch0106/08",
    "ch0106/09",
    "ch0106/10",
    "ch0106/11",
    "ch0110/03",
    "ch0110/04",
    "ch0107/02",
  ],
  4: [
    "ch0106/01",
    "ch0106/02",
    "ch0106/04",
    "ch0106/05",
    "ch0106/06",
    "ch0106/07",
    "ch0109/01",
    "ch0109/05",
    "ch0109/07",
    "ch0110/01",
  ],
}[cfg.homeworkId];
if (!document.querySelector(".account-link")) throw alert("login required");
if (!cfg.studentName === "无名氏") throw alert("please modify the config");
document.lastChild.appendChild(document.createElement("style")).textContent = `
body::before { content: ""; position: fixed; left: 40px; top: 40px; padding: 20px; border: 8px solid #37b; border-radius: 25%; z-index: 2000; animation: spin 12s linear; }
@keyframes spin { 100% { transform: rotate(3600deg) } }
`;
const results = cfg.problems.map(() => null);
const tasks = cfg.problems.map(async (path, idx) => {
  const [ch, subId] = path.split("/");
  const queryUrl = `/${ch}/status/?problemNumber=${subId}&userName=${cfg.userId}`;
  const queryPage = await fetch(queryUrl).then((r) => r.text());
  const table = queryPage.split(/<\/?table>/g)[1];
  const entry = table.split(/<\/?tr>/).find((v) => v.includes("Accepted"));
  const record = [];
  for (let s = entry; s !== ""; ) {
    if (s.startsWith("<")) s = s.slice(s.indexOf(">"));
    let idx = s.indexOf("<");
    if (idx === -1) break;
    let v = s.slice(1, idx).trim();
    if (v) record.push(v);
    s = s.slice(idx).trim();
  }
  record[1] = { text: record[1], target: location.origin + queryUrl };
  const solutionUrl = entry.match(/(?<=language"><a href=")[^"]+/)[0];
  const solutionPage = await fetch(solutionUrl).then((r) => r.text());
  const codeExactor = document.createElement("p");
  codeExactor.innerHTML = solutionPage.match(/<pre(.|\n)+?<\/pre>/)[0];
  results[idx] = { path, code: codeExactor.textContent, record };
});
tasks.push(
  import(`https://cdn.jsdelivr.net/npm/docx@7.7.0/build/index.min.js`)
);
Promise.all(tasks).then(async () => {
  const {
    AlignmentType,
    BorderStyle,
    Document,
    ExternalHyperlink,
    Footer,
    Packer,
    PageNumber,
    PageNumberSeparator,
    Paragraph,
    Table,
    TableCell,
    TableRow,
    TextRun,
    UnderlineType,
    WidthType,
  } = docx;
  const genProblemPart = ({ num, path, code, record }) => [
    new Paragraph({
      spacing: { before: 500, after: 200 },
      children: [
        new TextRun({
          text: `Problem ${num.toString().padStart(2, "0")}`,
          bold: true,
          size: 24,
          font: "Arial",
        }),
      ],
    }),
    new Paragraph({
      spacing: { before: 200, line: 300 },
      children: [
        new TextRun({
          text: "Description: ",
          font: "Times New Roman",
          size: 21,
          bold: true,
        }),
        new TextRun({
          text: "Read the problem at ",
          font: "Times New Roman",
          size: 21,
        }),
        new TextRun({
          text: `http://noi.openjudge.cn/${path}/`,
          font: "Times New Roman",
          size: 21,
          italics: true,
        }),
        new TextRun({
          text: ", try to make your program ",
          font: "Times New Roman",
          size: 21,
        }),
        new TextRun({
          text: "accepted",
          font: "Times New Roman",
          size: 21,
          italics: true,
        }),
        new TextRun({
          text: " by the OJ system.",
          font: "Times New Roman",
          size: 21,
        }),
      ],
    }),
    new Paragraph({
      spacing: { before: 150, after: 150 },
      children: [
        new TextRun({
          text: "My Program:",
          font: "Segoe UI Semibold",
          size: 21,
          underline: { type: UnderlineType.DOUBLE },
        }),
      ],
    }),
    ...code.split("\n").map(
      (text) =>
        new Paragraph({
          spacing: { line: 280 },
          indent: { left: 400 },
          alignment: AlignmentType.LEFT,
          children: [new TextRun({ text, font: "Consolas", size: 21 })],
        })
    ),
    new Paragraph({
      spacing: { before: 150, after: 150 },
      children: [
        new TextRun({
          text: "My Result:",
          font: "Segoe UI Semibold",
          size: 21,
          underline: { type: UnderlineType.DOUBLE },
        }),
      ],
    }),
    new Table({
      rows: [
        new TableRow({
          children: "提交人|题目|结果|分数|内存|时间|代码长度|语言"
            .split("|")
            .map(
              (field, i) =>
                new TableCell({
                  width: {
                    size: [1500, 3500, 800, 600, 800, 800, 900, 600][i],
                    type: WidthType.DXA,
                  },
                  margins: { top: 0, bottom: 0, left: 100, right: 100 },
                  borders: {
                    top: { style: BorderStyle.SINGLE, color: "DDDDDD" },
                    right: { style: BorderStyle.SINGLE, color: "DDDDDD" },
                    bottom: { style: BorderStyle.SINGLE, color: "DDDDDD" },
                    left: { style: BorderStyle.SINGLE, color: "DDDDDD" },
                  },
                  shading: { fill: "E0EAF1" },
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          text: field,
                          font: "Microsoft YaHei",
                          size: 16,
                        }),
                      ],
                    }),
                  ],
                })
            ),
        }),
        new TableRow({
          children: record.slice(0, 8).map(
            (entry, i) =>
              new TableCell({
                width: {
                  size: [1500, 3500, 800, 600, 800, 800, 900, 600][i], // sync with upper code
                  type: WidthType.DXA,
                },
                margins: { top: 0, bottom: 0, left: 100, right: 100 },
                borders: {
                  top: { style: BorderStyle.SINGLE, color: "DDDDDD" },
                  right: { style: BorderStyle.SINGLE, color: "DDDDDD" },
                  bottom: { style: BorderStyle.SINGLE, color: "DDDDDD" },
                  left: { style: BorderStyle.SINGLE, color: "DDDDDD" },
                },
                children: [
                  new Paragraph({
                    children: [
                      entry.target
                        ? new ExternalHyperlink({
                            children: [
                              new TextRun({
                                text: entry.text,
                                font: "Microsoft YaHei",
                                size: 16,
                                color: "3070B0",
                              }),
                            ],
                            link: entry.target,
                          })
                        : new TextRun({
                            text: entry,
                            font: "Microsoft YaHei",
                            size: 16,
                          }),
                    ],
                  }),
                ],
              })
          ),
        }),
      ],
    }),
  ];
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: { top: "2cm", right: "2cm", bottom: "2cm", left: "2cm" },
            pageNumbers: { start: 1, separator: PageNumberSeparator.COLON },
          },
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    children: [
                      PageNumber.CURRENT,
                      " / ",
                      PageNumber.TOTAL_PAGES,
                    ],
                    font: "Microsoft YaHei",
                    size: 18,
                  }),
                ],
              }),
            ],
          }),
        },
        children: [
          new Paragraph({
            spacing: { before: 200, after: 200 },
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: `Homework ${cfg.homeworkId.toString().padStart(2, "0")}`,
                bold: true,
                size: 32,
                font: "Microsoft YaHei",
              }),
            ],
          }),
          new Paragraph({
            spacing: { before: 400, after: 720 },
            children: [
              new TextRun({
                text: "Student ID:   ",
                bold: true,
                size: 28,
                font: "Calibri",
              }),
              new TextRun({
                text: `\t\t ${cfg.userId}\t\t`,
                size: 28,
                font: "Times New Roman",
                underline: { type: UnderlineType.SINGLE },
              }),
              new TextRun({
                text: "   Name:   ",
                bold: true,
                size: 28,
                font: "Calibri",
              }),
              new TextRun({
                text: `\t\t  ${cfg.studentName} \t\t`,
                size: 28,
                font: "宋体",
                underline: { type: UnderlineType.SINGLE },
              }),
            ],
            alignment: AlignmentType.CENTER,
          }),
          ...results.flatMap((v, i) => genProblemPart({ num: i + 1, ...v })),
        ],
      },
    ],
  });
  const saveLink = document.createElement("a");
  saveLink.download = `${cfg.userId}.docx`;
  saveLink.href = URL.createObjectURL(await Packer.toBlob(doc));
  saveLink.click();
});

// document.lastChild.appendChild(document.createElement("style")).textContent = `
// table{ width: 100vw; background: #fff; position: fixed; top: 0; left: 0; z-index: 99999; box-shadow:0 0 0 20px #fff; }
// tr:not(:first-child){ opacity:0; }
// #footer { display:none; }
// `.replace(/;/g, "!important;");
// ~/misc/apps/miniserve -p 9973 --header cache-control:max-age=3 /home/kkocdko/misc/code/user-scripts/scripts/ojcn-report-gen
// http://127.0.0.1:9973/index.html
