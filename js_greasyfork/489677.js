// ==UserScript==
// @name         Monarch Money (Charts)
// @namespace    http://tampermonkey.net/
// @version      0.26.0
// @description  Additional trend charts added to Monarch Money's dashboard page.
// @author       William T. Wissemann
// @match        https://app.monarchmoney.com/*
// @match        https://app.monarch.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=monarchmoney.com
// @grant        none
// @run-at       document-idle
// @require      https://cdn.jsdelivr.net/npm/chart.js@4.4.2/dist/chart.umd.min.js
// @require      https://cdn.jsdelivr.net/npm/chartjs-adapter-date-fns@3.0.0/dist/chartjs-adapter-date-fns.bundle.min.js
// @require      https://cdn.jsdelivr.net/npm/hammerjs@2.0.8
// @require      https://cdn.jsdelivr.net/npm/chartjs-plugin-crosshair@2.0.0/dist/chartjs-plugin-crosshair.min.js
// @require      https://cdn.jsdelivr.net/npm/chartjs-plugin-zoom@2.0.1/dist/chartjs-plugin-zoom.min.js
// @downloadURL https://update.greasyfork.org/scripts/489677/Monarch%20Money%20%28Charts%29.user.js
// @updateURL https://update.greasyfork.org/scripts/489677/Monarch%20Money%20%28Charts%29.meta.js
// ==/UserScript==

const graphql = 'https://api.monarch.com/graphql';
const START_DATE = '2010-01-01';
var cashFlowSearch = undefined;

function accountTypeToColor(accountType, alpha) {
  const lookup = {
    'Net Worth': `rgba(55, 162, 235, ${alpha})`, // blue
    'Credit Cards': `rgba(255, 159, 65, ${alpha})`, // orange
    Loans: `rgba(255, 99, 132, ${alpha})`, // red
    Investments: `rgba(255, 205, 87, ${alpha})`, // yellow
    Cash: `rgba(76, 192, 192, ${alpha})`, // green
    'Real Estate': `rgba(153, 102, 255, ${alpha})`, // purple
    Valuables: `rgba(201, 203, 207, ${alpha})`, // gray
    Vehicles: `rgba(55, 162, 235, ${alpha})`, // blue
    Equity: `rgba(55, 162, 235, ${alpha})`, // blue
  };

  return lookup[accountType];
}

function getPersistReports() {
  return JSON.parse(JSON.parse(localStorage.getItem('persist:reports')).filters);
}

function getSearchParam(paramName) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(paramName);
}

function getStyle() {
  const cssObj = window.getComputedStyle(document.querySelectorAll('[class*=Page__Root]')[0], null);
  const bgColor = cssObj.getPropertyValue('background-color');
  if (bgColor === 'rgb(25, 25, 24)') {
    return 'dark';
  }
  return 'light';
}

function getGraphqlToken() {
  return JSON.parse(JSON.parse(localStorage.getItem('persist:root')).user).token;
}
function createGraphOption(data) {
  return {
    mode: 'cors',
    method: 'POST',
    headers: {
      accept: '*/*',
      authorization: `Token ${getGraphqlToken()}`,
      'content-type': 'application/json',
      origin: 'https://app.monarchmoney.com',
    },
    body: JSON.stringify(data),
  };
}

async function getAccountHistory(id) {
  const options = createGraphOption({
    operationName: 'AccountDetails_getAccount',
    variables: {
      id,
    },
    query: 'query AccountDetails_getAccount($id: UUID!, $filters: TransactionFilterInput) {\n  account(id: $id) {\n    id\n    ...AccountFields\n    ...EditAccountFormFields\n    credential {\n      id\n      institution {\n        id\n        ...InstitutionStatusFields\n        __typename\n      }\n      __typename\n    }\n    institution {\n      id\n      ...InstitutionStatusFields\n      __typename\n    }\n    __typename\n  }\n  transactions: allTransactions(filters: $filters) {\n    totalCount\n    results(limit: 1) {\n      id\n      ...TransactionsListFields\n      __typename\n    }\n    __typename\n  }\n  snapshots: snapshotsForAccount(accountId: $id) {\n    date\n    signedBalance\n    __typename\n  }\n}\n\nfragment AccountFields on Account {\n  id\n  displayName\n  syncDisabled\n  deactivatedAt\n  isHidden\n  isAsset\n  mask\n  createdAt\n  updatedAt\n  displayLastUpdatedAt\n  currentBalance\n  displayBalance\n  includeInNetWorth\n  hideFromList\n  hideTransactionsFromReports\n  includeBalanceInNetWorth\n  includeInGoalBalance\n  dataProvider\n  dataProviderAccountId\n  isManual\n  transactionsCount\n  holdingsCount\n  manualInvestmentsTrackingMethod\n  order\n  icon\n  logoUrl\n  type {\n    name\n    display\n    group\n    __typename\n  }\n  subtype {\n    name\n    display\n    __typename\n  }\n  credential {\n    id\n    updateRequired\n    disconnectedFromDataProviderAt\n    dataProvider\n    institution {\n      id\n      plaidInstitutionId\n      name\n      status\n      logo\n      __typename\n    }\n    __typename\n  }\n  institution {\n    id\n    name\n    logo\n    primaryColor\n    url\n    __typename\n  }\n  __typename\n}\n\nfragment EditAccountFormFields on Account {\n  id\n  displayName\n  deactivatedAt\n  displayBalance\n  includeInNetWorth\n  hideFromList\n  hideTransactionsFromReports\n  dataProvider\n  dataProviderAccountId\n  isManual\n  manualInvestmentsTrackingMethod\n  isAsset\n  invertSyncedBalance\n  canInvertBalance\n  useAvailableBalance\n  canUseAvailableBalance\n  type {\n    name\n    display\n    __typename\n  }\n  subtype {\n    name\n    display\n    __typename\n  }\n  __typename\n}\n\nfragment InstitutionStatusFields on Institution {\n  id\n  hasIssuesReported\n  hasIssuesReportedMessage\n  plaidStatus\n  status\n  balanceStatus\n  transactionsStatus\n  __typename\n}\n\nfragment TransactionsListFields on Transaction {\n  id\n  ...TransactionOverviewFields\n  __typename\n}\n\nfragment TransactionOverviewFields on Transaction {\n  id\n  amount\n  pending\n  date\n  hideFromReports\n  plaidName\n  notes\n  isRecurring\n  reviewStatus\n  needsReview\n  isSplitTransaction\n  dataProviderDescription\n  attachments {\n    id\n    __typename\n  }\n  category {\n    id\n    name\n    icon\n    group {\n      id\n      type\n      __typename\n    }\n    __typename\n  }\n  merchant {\n    name\n    id\n    transactionsCount\n    __typename\n  }\n  tags {\n    id\n    name\n    color\n    order\n    __typename\n  }\n  account {\n    id\n    displayName\n    icon\n    logoUrl\n    __typename\n  }\n  __typename\n}',
  });

  return fetch(graphql, options)
    .then((response) => response.json())
    .then((data) => {
      const today = new Date().toISOString().slice(0, 10);
      const differenceInDays = (new Date(today).getTime() - new Date(START_DATE).getTime()) / (1000 * 3600 * 24) + 1;

      // Create the array filled with nulls
      const recentBalances = new Array(differenceInDays).fill(null);
      for (let i = 0; i < data.data.snapshots.length; i += 1) {
        const index = getDateIndex(data.data.snapshots[i].date);
        if (index > -1) {
          recentBalances[index] = data.data.snapshots[i].signedBalance;
        }
      }
      return recentBalances;
    }).catch((error) => {
      console.error(error);
    });
}

function getDateIndex(dateString) {
  // Calculate the difference in days from the start date
  const differenceInDays = (new Date(dateString).getTime() - new Date(START_DATE).getTime()) / (1000 * 3600 * 24) + 1;

  // Check for invalid dates (before start date)
  if (differenceInDays <= 0) {
    return -1; // Return -1 for dates before the start date
  }

  // Return the index within the array (0-based)
  return differenceInDays - 1;
}

async function getAccountDetails() {
  const options = createGraphOption({
    operationName: 'Web_GetAccountsPage',
    variables: {},
    query: 'query Web_GetAccountsPage {\n  hasAccounts\n  accountTypeSummaries {\n    type {\n      name\n      display\n      group\n      __typename\n    }\n    accounts {\n      id\n      ...AccountsListFields\n      __typename\n    }\n    totalDisplayBalance\n    __typename\n  }\n  householdPreferences {\n    id\n    accountGroupOrder\n    __typename\n  }\n}\n\nfragment AccountsListFields on Account {\n  id\n  syncDisabled\n  isHidden\n  isAsset\n  includeInNetWorth\n  order\n  type {\n    name\n    display\n    __typename\n  }\n  ...AccountListItemFields\n  __typename\n}\n\nfragment AccountListItemFields on Account {\n  id\n  displayName\n  displayBalance\n  signedBalance\n  updatedAt\n  syncDisabled\n  icon\n  logoUrl\n  isHidden\n  isAsset\n  includeInNetWorth\n  includeBalanceInNetWorth\n  displayLastUpdatedAt\n  ...AccountMaskFields\n  credential {\n    id\n    updateRequired\n    dataProvider\n    disconnectedFromDataProviderAt\n    __typename\n  }\n  institution {\n    id\n    ...InstitutionStatusTooltipFields\n    __typename\n  }\n  __typename\n}\n\nfragment AccountMaskFields on Account {\n  id\n  mask\n  subtype {\n    display\n    __typename\n  }\n  __typename\n}\n\nfragment InstitutionStatusTooltipFields on Institution {\n  id\n  logo\n  name\n  status\n  plaidStatus\n  hasIssuesReported\n  url\n  hasIssuesReportedMessage\n  transactionsStatus\n  balanceStatus\n  __typename\n}',
  });
  return fetch(graphql, options)
    .then((response) => response.json())
    .then((data) => {
      const accountDetails = data.data.accountTypeSummaries;
      const accountLookupById = {};
      for (let i = 0; i < accountDetails.length; i += 1) {
        const { display } = accountDetails[i].type;
        for (let j = 0; j < accountDetails[i].accounts.length; j += 1) {
          accountLookupById[accountDetails[i].accounts[j].id] = {
            type: display,
            displayName: accountDetails[i].accounts[j].displayName,
            accountData: accountDetails[i].accounts[j],
          };
        }
      }
      data.accountLookupById = accountLookupById;
      return data;
    }).catch((error) => {
      console.error(error);
    });
}
async function getAccountPageRecentBalanceByDate(date) {
  const data = await fetch(graphql, createGraphOption({
    operationName: 'Web_GetAccountsPageRecentBalance',
    variables: {
      startDate: date,
    },
    query: `query Web_GetAccountsPageRecentBalance($startDate: Date!) {
            accounts {
                id
                recentBalances(startDate: $startDate)
                __typename
            }
        }`,
  }))
    .then((response) => response.json())
    .then((data) => data).catch((error) => {
      console.error(error);
    });

  for (let i = 0; i < data.data.accounts.length; i += 1) {
    const recentBalances = await getAccountHistory(data.data.accounts[i].id).then((data) => data);
    data.data.accounts[i].recentBalances = recentBalances;
  }

  return data;
}

async function getAccountPageRecentBalance() {
  const today = new Date().toISOString().slice(0, 10);

  try {
    const cachedData = JSON.parse(localStorage?.getItem('tm:AccountPageRecentBalance') ?? '{}');

    if (
      !cachedData.cacheDate
      || cachedData.cacheDate !== today
      || !cachedData.data
      || !cachedData.data.data
      || !cachedData.data.data.accounts
      || !Array.isArray(cachedData.data.data.accounts[0]?.recentBalances)
      || cachedData.data.data.accounts[0].recentBalances.length
        !== (new Date(today).getTime() - new Date(START_DATE).getTime()) / (1000 * 3600 * 24) + 1
    ) {
      const freshData = await getAccountPageRecentBalanceByDate(START_DATE);
      localStorage.setItem('tm:AccountPageRecentBalance', JSON.stringify({ cacheDate: today, data: freshData }));
      return freshData;
    }

    return cachedData.data;
  } catch (error) {
    console.error('Error handling cached data:', error);
    const freshData = await getAccountPageRecentBalanceByDate(START_DATE);
    localStorage.setItem('tm:AccountPageRecentBalance', JSON.stringify({ cacheDate: today, data: freshData }));
    return freshData;
  }
}

function recentBalancesMerge(data, label) {
  let offset = 0;
  const date = new Date(START_DATE);
  if (data.length === 0){
      return {
      label,
      data: null,
      borderColor: accountTypeToColor(label, '255'),
      backgroundColor: accountTypeToColor(label, '0.2'),
      borderWidth: 1,
      fill: true,
      pointRadius: 0,
      hidden: !['Net Worth', 'Investments', 'Cash'].includes(label),
    };
  }

  const dataset = {
    label,
    data: data[0].recentBalances.map((item) => {
      offset += 1;
      const d = new Date(date.getFullYear(), date.getMonth(), date.getDate() + offset);
      return { x: d.toISOString().slice(0, 10), y: item };
    }),
    borderColor: accountTypeToColor(label, '255'),
    backgroundColor: accountTypeToColor(label, '0.2'),
    borderWidth: 1,
    fill: true,
    pointRadius: 0,
    hidden: !['Net Worth', 'Investments', 'Cash'].includes(label),
  };



  for (let i = 1; i < data.length; i += 1) {
    if (data[i].recentBalances === undefined) {
      console.log(data[i])
      continue;
    }

    for (let j = 0; j < data[i].recentBalances.length; j += 1) {
      const val = data[i].recentBalances[j];
      if (dataset.data[j].y === undefined) {
        dataset.data[j].y = val;
      } else if (val !== null) {
        dataset.data[j].y += val;
      }
    }
  }
  return dataset;
}

function chartStyleOption(title) {
  let labels = {
    fontColor: 'rgba(256, 256, 256)',
  };
  if (getStyle() === 'dark') {
    Chart.defaults.color = 'rgba(255, 255, 255, 0.7)';
    Chart.defaults.borderColor = 'rgba(255, 255, 255, 0.3)';
    labels = {};
  } else {
    Chart.defaults.color = 'rgba(0, 0, 0, 0.7)';
    Chart.defaults.borderColor = 'rgba(0, 0, 0, 0.2)';
    labels = {};
  }

  return {
    maintainAspectRatio: false,
    responsive: true,
    resizeDelay: 1000,

    legend: {
      labels,
    },
    interaction: {
      axis: 'x',
      mode: 'nearest',
      intersect: false,
    },
    plugins: {
      crosshair: {
        line: {
          color: 'rgba(55, 162, 235, .5)', // crosshair line color
          width: 1, // crosshair line width
        },
      },
      tooltip: {
        position: 'nearest',
        backgroundColor: 'rgba(0, 0, 0, .65)',
        callbacks: {
          label(context) {
            let label = context.dataset.label || '';

            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null && label !== 'Savings Rate: ') {
              label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(context.parsed.y);
            } else if (context.parsed.y !== null && label === 'Savings Rate: ') {
              label += `${context.parsed.y.toFixed(2)}%`;
            }
            return label;
          },
          title(context) {
            const label = context[0].label || '';
            return label.match(/^\w+ \d+, \d+/)[0];
          },
        },
      },
      title: {
        display: true,
        text: title,
      },
      zoom: {
        limits: {
          x: { min: 'original', max: 'original' },
        },
        zoom: {
          wheel: {
            enabled: true,
            modifierKey: 'shift',
          },
          drag: {
            enabled: true,
          },
          pinch: {
            enabled: true,
          },
          mode: 'x',
        },
      },
    },
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'month',
        },
        border: {
          dash: [5, 8],
        },
        ticks: {
          major: {
            enabled: true,
          },
          callback(value, index, values) {
            const d = new Date(value);
            const year = d.getFullYear();
            const month = d.getMonth();
            const day = d.getDay();
            const mShort = d.toLocaleString('en-US', { month: 'short' });

            if (values[index] !== undefined) {
              if (month == 0) {
                values[index].major = true;
                return `${year} ${mShort}`;
              }
              return `${mShort}`;
            }
          },
        },
      },
      y: {
        type: localStorage['tm:YChartType'] || 'linear',
        ticks: {
          beginAtZero: true,
        },
        border: {
          dash: [5, 8],
        },
      },
    },
  };
}

function drawCashFlowAggregates(chart, timeframe, accounts, tags, category) {
  fetch(graphql, createGraphOption({
    operationName: 'Web_CashFlowAggregates',
    variables: {
      filters: {
        search: '', categories: category, accounts, tags,
      },
    },
    query: 'query Web_CashFlowAggregates($filters: TransactionFilterInput) {\n  byYear: aggregates(groupBy: ["year"], fillEmptyValues: true, filters: $filters) {\n    groupBy {\n      year\n      __typename\n    }\n    summary {\n      savings\n      savingsRate\n      sumIncome\n      sumExpense\n      __typename\n    }\n    __typename\n  }\n  byMonth: aggregates(\n    groupBy: ["month"]\n    fillEmptyValues: true\n    filters: $filters\n  ) {\n    groupBy {\n      month\n      __typename\n    }\n    summary {\n      savings\n      savingsRate\n      sumIncome\n      sumExpense\n      __typename\n    }\n    __typename\n  }\n  byQuarter: aggregates(\n    groupBy: ["quarter"]\n    fillEmptyValues: true\n    filters: $filters\n  ) {\n    groupBy {\n      quarter\n      __typename\n    }\n    summary {\n      savings\n      savingsRate\n      sumIncome\n      sumExpense\n      __typename\n    }\n    __typename\n  }\n}',
  })).then((response) => response.json())
    .then((d) => {
      // Process the data received from the API
      const { data } = d;
      const datasets = [];

      let dataBy = data.byMonth;
      if (timeframe === 'year') {
        dataBy = data.byYear;
      } else if (timeframe === 'quarter') {
        dataBy = data.byQuarter;
      }

      const savingsData = [];
      const savingsRateData = [];
      const sumIncomeData = [];
      const sumExpenseData = [];

      for (let i = 0; i < dataBy.length; i += 1) {
        // User selects an account type
        let date = dataBy[i].groupBy.month;
        if (timeframe === 'year') {
          date = dataBy[i].groupBy.year;
        } else if (timeframe === 'quarter') {
          date = dataBy[i].groupBy.quarter;
        }
        const {
          savings, savingsRate, sumIncome, sumExpense,
        } = dataBy[i].summary;

        if (category === undefined) {
          savingsData.push({ x: date, y: savings });
          savingsRateData.push({ x: date, y: savingsRate * 100 });
        }

        sumIncomeData.push({ x: date, y: sumIncome });
        sumExpenseData.push({ x: date, y: sumExpense });
      }

      const i = {
        type: 'line',
        stack: 'combinded',
        label: 'Income',
        data: sumIncomeData,
        borderColor: 'rgba(48, 164, 108, 255)',
        backgroundColor: 'rgba(48, 164, 108, 0.2)',
        fill: true,
        borderWidth: 2,
        pointRadius: 0,
      };
      if (i.data.length > 0) {
        i.data.sort((a, b) => a.x.localeCompare(b.x));
        if (i.data.some((item) => item.y !== 0)) {
          datasets.push(i);
        }
      }

      const e = {
        type: 'line',
        label: 'Expenses',
        stack: 'combinded',
        data: sumExpenseData,
        borderColor: 'rgba(228, 72, 78, 255)',
        backgroundColor: 'rgba(228, 72, 78, 0.2)',
        fill: true,
        borderWidth: 2,
        pointRadius: 0,
      };
      if (e.data.length > 0) {
        e.data.sort((a, b) => a.x.localeCompare(b.x));
        if (e.data.some((item) => item.y !== 0)) {
          datasets.push(e);
        }
      }

      let lineStyle = 'rgba(0, 0, 0, 0.8)';
      if (getStyle() === 'dark') {
        lineStyle = 'rgba(238, 238, 236, 0.8)';
      }

      const s = {
        label: 'Savings',
        data: savingsData,
        borderColor: lineStyle,
        fill: false,
        borderWidth: 2,
        pointRadius: 0,
      };
      if (s.data.length > 0) {
        s.data.sort((a, b) => a.x.localeCompare(b.x));
        datasets.push(s);
      }
      const sr = {
        label: 'Savings Rate',
        data: savingsRateData,
        borderColor: lineStyle,
        fill: false,
        borderWidth: 2,
        pointRadius: 0,
      };
      if (sr.data.length > 0) {
        sr.data.sort((a, b) => a.x.localeCompare(b.x));
        datasets.push(sr);
      }

      // Create a new Chart.js instance
      const ctx = chart.getContext('2d');
      // eslint-disable-next-line no-new
      new Chart(ctx, {
        type: 'line',
        data: {
          datasets,
        },
        options: chartStyleOption('CASH FLOW'),
      });
    })
    .catch((error) => {
      console.error(error);
    });
}

function drawSnapshotsByAccountType(chart) {
  fetch(graphql, createGraphOption({
    operationName: 'Common_GetSnapshotsByAccountType',
    variables: {
      startDate: START_DATE,
      timeframe: 'month',
    },
    query: `query Common_GetSnapshotsByAccountType($startDate: Date!, $timeframe: Timeframe!) {
                    snapshotsByAccountType(startDate: $startDate, timeframe: $timeframe) {
                        accountType
                        month
                        balance
                        __typename
                    }
                    accountTypes {
                        name
                        display
                        group
                        __typename
                    }
                }`,
  })).then((response) => response.json())
    .then((d) => {
      // Process the data received from the API
      const { data } = d;

      const datasets = [{
        label: 'Net Worth',
        borderColor: accountTypeToColor('Net Worth', '255'),
        backgroundColor: accountTypeToColor('Net Worth', '0.2'),
        data: [],
        fill: true,
        borderWidth: 2,
        pointRadius: 0,
        hidden: false,
      }];
      const netWorth = {};
      for (let i = 0; i < data.accountTypes.length; i += 1) {
        // User selects an account type
        const selectedAccountType = data.accountTypes[i].name;
        const selectedAccountDisplay = data.accountTypes[i].display;

        if (selectedAccountDisplay === 'Other') {
          continue;
        }

        // Filter snapshots by selected account type
        const filteredSnapshots = data.snapshotsByAccountType.filter(
          (snapshot) => snapshot.accountType === selectedAccountType,
        );
        // Extract relevant data from filtered snapshots
        // const balances = filteredSnapshots.map(snapshot => snapshot.balance);
        const balances = filteredSnapshots.map((snapshot) => {
          const date = snapshot.month;
          if (netWorth[date] !== undefined) {
            netWorth[date].y += snapshot.balance;
          } else {
            netWorth[date] = { x: date, y: snapshot.balance };
          }
          return { x: date, y: snapshot.balance };
        });

        const set = {
          label: selectedAccountDisplay,
          data: balances,
          borderColor: accountTypeToColor(selectedAccountDisplay, '255'),
          backgroundColor: accountTypeToColor(selectedAccountDisplay, '0.2'),
          fill: true,
          borderWidth: 2,
          pointRadius: 0,
          hidden: !['brokerage', 'depository'].includes(selectedAccountType),
        };
        if (set.data.length > 0) {
          datasets.push(set);
        }
      }

      Object.values(netWorth).forEach((value) => {
        datasets[0].data.push(value);
      });

      datasets[0].data.sort((a, b) => a.x.localeCompare(b.x));

      // Create a new Chart.js instance
      const ctx = chart.getContext('2d');
      // eslint-disable-next-line no-new
      new Chart(ctx, {
        type: 'line',
        data: {
          datasets,
        },
        options: chartStyleOption('ACCOUNT TRENDS: WITHOUT FILTERS'),
      });
    })
    .catch((error) => {
      console.error(error);
    });
}

function drawNetworthChart(chart) {
  const persistFilters = getPersistReports();
  getAccountDetails().then((accountDetails) => {
    getAccountPageRecentBalance()
      .then((d) => {
        // Process the data received from the API
        let data = null;
        if (persistFilters.accounts !== undefined) {
          data = d.data.accounts.filter((object) => persistFilters.accounts.includes(object.id));
        } else {
          data = d.data.accounts;
        }

        const accountTypes = [];
        for (let i = 0; i < data.length; i += 1) {
          if (accountDetails.accountLookupById[data[i].id] !== undefined) {
            const { displayName, type, accountData } = accountDetails.accountLookupById[data[i].id];
            data[i].displayName = displayName;
            data[i].type = type;
            data[i].includeInNetWorth = accountData.includeInNetWorth;

            if (!accountTypes.includes(type)) {
              accountTypes.push(type);
            }
          }
        }

        data = data.filter((object) => object.includeInNetWorth === true);

        const datasets = [];
        datasets.push(recentBalancesMerge(data, 'Net Worth'));
        for (let i = 0; i < accountTypes.length; i += 1) {
          accountTypeData = recentBalancesMerge(data.filter((object) => [accountTypes[i]].includes(object.type)), accountTypes[i])
          if (accountTypeData.data === null) {
            accountTypeData.data = new Array(datasets[0].data.length).fill(0);
          }
          datasets.push(accountTypeData);
        }

        for (let i = 0; i < datasets.length; i += 1) {
          datasets[i].data = datasets[i].data.filter((dataset) => dataset.y !== 0 && dataset.y !== null);
        }
        // Create a new Chart.js instance
        const ctx = chart.getContext('2d');
        // eslint-disable-next-line no-new
        new Chart(ctx, {
          type: 'line',
          data: {
            datasets,
          },
          options: chartStyleOption('ACCOUNT TRENDS: REPORT FILTERS'),
        });
      }).catch((error) => {
        console.error(error);
      });
  });
}

function createChartDiv(claseName) {
  const chartDiv = document.createElement('div');
  chartDiv.className = 'TM_CHARTS';
  chartDiv.width = '100%';
  chartDiv.height = '400px';
  chartDiv.margin = 'auto';
  chartDiv.style.width = chartDiv.width;
  chartDiv.style.height = chartDiv.height;
  chartDiv.style.padding = '12px 22px 10px 22px';
  chartDiv.boxShadow = 'rgba(0, 0, 0, 0.2) 0px 4px 8px';

  const canvas = document.createElement('canvas');
  canvas.style.borderRadius = '25px';
  canvas.width = '100%';
  canvas.height = '400px';
  canvas.style.padding = '0px 10px 0px 0px';
  if (getStyle() === 'dark') {
    canvas.style.backgroundColor = 'rgb(34, 34, 35)';
  } else {
    canvas.style.backgroundColor = 'rgb(255, 255, 255)';
  }
  canvas.style.width = canvas.width;
  canvas.style.height = canvas.height;
  canvas.style.display = 'block';
  canvas.className = claseName;
  chartDiv.appendChild(canvas);
  return [canvas, chartDiv];
}

function unloadCharts() {
  const tmCharts = document.querySelectorAll('[class*=TM_CHARTS]');
  if (tmCharts.length > 0) {
    for (let i = 0; i < tmCharts.length; i += 1) {
      tmCharts[i].remove();
    }
  }
}

document.addEventListener('keydown', (event) => {
  console.log(event);
  if (event.ctrlKey === true && event.key === 'l') {
    // ctrl + l: toogle between log and liner
    localStorage['tm:YChartType'] = localStorage['tm:YChartType'] === 'logarithmic' ? 'linear' : 'logarithmic';
    console.log(localStorage['tm:YChartType']);
    unloadCharts();
  }
});

(function () {
  setInterval(() => {
    if (window.location.pathname === '/dashboard' && (document.querySelectorAll('[class*=TM_CHARTS]').length === 0 || localStorage['tm:DarkLightMode'] !== getStyle())) {
      const injectionInterval = setInterval(() => {
        if (localStorage['tm:DarkLightMode'] !== getStyle()) {
          unloadCharts();
        }
        // only run the injectionInterval once
        clearInterval(injectionInterval);
        // inject a div at the top of MM's scroll
        const scrollRoot = document.querySelectorAll('[class*=Scroll__Root]')[0];

        const [snapshotsByAccountCanvas, snapshotsByAccountDiv] = createChartDiv('TM_snapshotsByAccountType');
        scrollRoot.insertBefore(snapshotsByAccountDiv, scrollRoot.children[0]);
        drawSnapshotsByAccountType(snapshotsByAccountCanvas);

        const [networthCanvas, networthAccountDiv] = createChartDiv('TM_networthChart');
        scrollRoot.insertBefore(networthAccountDiv, scrollRoot.children[1]);
        drawNetworthChart(networthCanvas);

        localStorage['tm:DarkLightMode'] = getStyle();
      }, 1000);
    } else if (window.location.pathname === '/accounts' && (document.querySelectorAll('[class*=TM_CHARTS]').length === 0 || localStorage['tm:DarkLightMode'] !== getStyle())) {
      const injectionInterval = setInterval(() => {
        if (localStorage['tm:DarkLightMode'] !== getStyle()) {
          unloadCharts();
        }
        // only run the injectionInterval once
        clearInterval(injectionInterval);
        // inject a div at the top of MM's scroll
        const scrollRoot = document.querySelectorAll('[class*=Scroll__Root]')[0];

        const [snapshotsByAccountCanvas, snapshotsByAccountDiv] = createChartDiv('TM_snapshotsByAccountType');
        scrollRoot.insertBefore(snapshotsByAccountDiv, scrollRoot.children[0]);
        drawSnapshotsByAccountType(snapshotsByAccountCanvas);

        localStorage['tm:DarkLightMode'] = getStyle();
      }, 1000);
    } else if ((window.location.pathname === '/cash-flow' || window.location.pathname?.includes('/categories/'))
             && ((document.querySelectorAll('[class*=TM_CHARTS]').length === 0 || localStorage['tm:DarkLightMode'] !== getStyle())
             || ((window.location.pathname === '/cash-flow' || window.location.pathname?.includes('/categories/'))
                && cashFlowSearch !== window.location.search))) {
      const injectionInterval = setInterval(() => {
        if (localStorage['tm:DarkLightMode'] !== getStyle() || cashFlowSearch !== window.location.search) {
          unloadCharts();
        }
        // only run the injectionInterval once
        clearInterval(injectionInterval);
        // inject a div at the top of MM's scroll
        const scrollRoot = document.querySelectorAll('[class*=Scroll__Root]')[0];

        const [cashFlowAggregatesCanvas, cashFlowAggregatesDiv] = createChartDiv('TM_cashFlowAggregates');
        scrollRoot.insertBefore(cashFlowAggregatesDiv, scrollRoot.children[0]);
        drawCashFlowAggregates(
          cashFlowAggregatesCanvas,
          getSearchParam('timeframe'),
          getSearchParam('accounts')?.split(','),
          getSearchParam('tags')?.split(','),
          window.location.pathname?.split('/')[2],
        );

        localStorage['tm:DarkLightMode'] = getStyle();
        cashFlowSearch = window.location.search;
      }, 1000);
    }
  }, 5000);
}());
