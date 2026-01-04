// ==UserScript==
// @name        Just Students
// @namespace   https://github.com/Marado-Programer/
// @match       http*://oghma.epcc.pt/*
// @grant       none
// @version     1.2
// @author      al220007@epcc.pt
// @description Remove students that aren't students anymore
// @downloadURL https://update.greasyfork.org/scripts/464433/Just%20Students.user.js
// @updateURL https://update.greasyfork.org/scripts/464433/Just%20Students.meta.js
// ==/UserScript==

const url = window.location.href;

document.body.innerHTML = document.body.innerHTML.replaceAll(/João Rodrigues/g, "Draikontuga");
document.body.innerHTML = document.body.innerHTML.replaceAll(/João Afonso Andrade Rodrigues/g, "Draikontuga");

document.querySelectorAll("li.student, tr.student").forEach((student) => {
  if (!student.classList.contains("active")) student.remove();
});

if (url.match(/units/)) {
  document.querySelectorAll("table.evaluations tr").forEach((student, i) => {
    if (i != 0 && !student.classList.contains("active")) student.remove();
  });
  const evaluationsTable = document.getElementsByClassName("evaluations")[1],
    evaluations = document.querySelectorAll("table.evaluations tr.active");
  const orderedEvaluations = [].slice.call(evaluations).sort((x, y) =>
    x.querySelector(".number")
      ? (x.querySelector(".number").childNodes[0].nodeValue -
        y.querySelector(".number").childNodes[0].nodeValue)
      : (x.querySelector("td:nth-child(4)").innerText -
        y.querySelector("td:nth-child(4)").innerText)
  );

  evaluations.forEach((i) => i.remove());

  orderedEvaluations.forEach((i) => evaluationsTable.append(i));
} else if (url.match(/users/)) {
  const evaluationsTable = document.getElementsByClassName("evaluations")[1],
    evaluations = document.querySelectorAll("table.evaluations tr.evaluation");

  const date = /(\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2} UTC)/;

  const orderedEvaluations = [].slice.call(evaluations).sort((x, y) => {
    const xDate = new Date(date.exec(x.childNodes[15].title)[1]);
    const yDate = new Date(date.exec(y.childNodes[15].title)[1]);

    //return xDate - yDate;
    return x.childNodes[5].innerHTML - y.childNodes[5].innerHTML;
  });

  const avg = orderedEvaluations.reduce((x, y) =>
    parseInt(
      typeof x === "number" ? x : x.querySelector("td:nth-child(3)").innerText,
      10,
    ) + parseInt(
      typeof y === "number" ? y : y.querySelector("td:nth-child(3)").innerText,
      10,
    )
  );

  evaluations.forEach((i) => i.remove());

  orderedEvaluations.forEach((i) => evaluationsTable.append(i));
  const avgtr = document.createElement("tr");
  avgtr.append(document.createElement("td"));
  avgtr.append(document.createElement("td"));
  const avgtd = document.createElement("td");
  const b = document.createElement("b");
  b.append(
    document.createTextNode(`Average: ${avg / orderedEvaluations.length}`),
  );
  avgtd.append(b);
  avgtr.append(avgtd);
  avgtr.append(document.createElement("td"));
  avgtr.append(document.createElement("td"));
  avgtr.append(document.createElement("td"));
  avgtr.append(document.createElement("td"));
  avgtr.append(document.createElement("td"));
  avgtr.append(document.createElement("td"));
  evaluationsTable.append(avgtr);
} else if (url.match(/\/courses\/?$/)) {
  Promise.all(
    [].slice.call(
      document.querySelectorAll(
        "#main > div > div.span10.main > table > tbody > tr a",
      ),
    ).map((i) =>
      fetch(`${i.href}/evaluations`).then((res) => res.text()).then(
        (course) => {
          const you_start = course.indexOf('<tr class="active me">');
          const you = course.substring(
            you_start,
            course.indexOf("</tr>", you_start),
          ).trim();
          const rate_start = you.indexOf('<td class="number">');
          const matches = you.substring(
            rate_start,
            you.indexOf("</td>", rate_start),
          ).match(/(\d+\.\d+).*\d+\/(\d+)/);
          if (matches == null) return;
          const [, rate, _modules] = matches;
          return rate;
        },
      )
    ),
  ).then((rates) => rates.filter((i) => typeof i === "string")).then((rates) =>
    rates.reduce((x, y) => parseFloat(x, 10) + parseFloat(y, 10)) / rates.length
  ).then((avg) => console.log(avg));
} else if (url.match("/courses/")) {
  (async () => {
    const pages = [].slice.call(
      document.querySelectorAll(
        "#main > div > div.span10.main > ul > li > a:nth-child(1)",
      ),
    ).map((
      i,
    ) => [i, fetch(`${i.href}/evaluations/`).then((res) => res.text())]);

    const unsorted = [];

    for (const [url, p] of pages) {
      const page = await p;
      const dummy = document.createElement("div");
      const start = page.indexOf("<table");
      dummy.innerHTML = page.substring(
        start,
        page.indexOf("</table>", start),
      ).trim();

      const evaluationsTable = dummy.getElementsByClassName("evaluations")[0],
        evaluations = dummy.querySelectorAll(
          "table.evaluations tr.evaluation",
        );

      const avg = [].slice.apply(evaluations).reduce((x, y) =>
        parseInt(
          typeof x === "number"
            ? x
            : x.querySelector("td:nth-child(3)").innerText,
          10,
        ) + parseInt(
          typeof y === "number"
            ? y
            : y.querySelector("td:nth-child(3)").innerText,
          10,
        ), 0);

      unsorted.push([url, (avg / evaluations.length).toFixed(3)]);
    }

    const allavg = unsorted.reduce(([, x], [, y]) => [undefined, parseFloat(Number.isNaN(+x) ? 0 : x, 10) + parseFloat(Number.isNaN(+y) ? 0 : y, 10)])[1] / unsorted.filter(([, x]) => !Number.isNaN(+x)).length;
    const avgli = document.createElement("li");
    avgli.classList.add("student");
    avgli.classList.add("active");
    //avgli.style.backgroundColor = "#FF1818";
    avgli.innerHTML = '<a href="#AVG"><img src="" style="height: 79px; width: auto"></a><span class=""></span><br><a href="#AVG">AVERAGE USER</a>';
    unsorted.push(["#AVG", allavg.toFixed(3)]);

    const lisorted = unsorted.sort(([, x], [, y]) => x - y).map(
      ([href, avg]) => {
        let student = null;

        if (href === "#AVG") {
          student = avgli;
        } else {
          const url = (new URL(href).pathname).replace(/\/?evaluations\/?/, "");
          student = document.querySelector(
            `#main > div > div.span10.main > ul > li:has(a[href="${url}"])`,
          );
        }

        const n = student.querySelector("span");
        if (n != null) {
          n.innerText += ` (${avg})`;
        }
        return student;
      },
    );

    const list = document.querySelector("#main > div > div.span10.main > ul");

    [].slice.apply(list.querySelectorAll("li")).forEach((i) => i.remove());

    lisorted.forEach((i) => list.append(i));
  })();
}
