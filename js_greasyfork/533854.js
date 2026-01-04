// ==UserScript==
// @name         Etherscan Spam-Block
// @description  Uses Kleros Tokens to check whether if a token "exists" or not in Etherscan-like explorers.
// @version      1.0
// @license      MIT
// @namespace    violentmonkey
// @match        https://etherscan.io/address/*
// @match        https://gnosisscan.io/address/*
// @match        https://arbiscan.io/address/*
// @match        https://polygonscan.com/address/*
// @match        https://bscscan.com/address/*
// @match        https://optimistic.etherscan.io/address/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/533854/Etherscan%20Spam-Block.user.js
// @updateURL https://update.greasyfork.org/scripts/533854/Etherscan%20Spam-Block.meta.js
// ==/UserScript==

(() => {
  /* ---------- config ---------- */
  const STORAGE_KEY = 'esh_validTokensCache';
  const endpoint =
    'https://api.studio.thegraph.com/query/61738/legacy-curate-gnosis/v0.1.1';

  const QUERY = `
    query($targetAddress: String!) {
      litems(
        where:{
          registry:"0xee1502e29795ef6c2d60f8d7120596abe3bad990",
          metadata_:{
            key0_starts_with_nocase:$targetAddress,
            key0_ends_with_nocase:$targetAddress
          },
          status_in:[Registered,ClearingRequested]
        },
        first:1
      ){id}
    }`;
  /* ---------- util ---------- */
  const cache = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); // {addr:boolean}

  const saveCache = () =>
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cache));

  const exists = async (addr) => {
    addr = addr.toLowerCase();
    if (addr in cache) return cache[addr];

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ query: QUERY, variables: { targetAddress: addr } }),
      });
      if (!res.ok) return null;
      const { data } = await res.json();
      const ok = !!(data && data.litems && data.litems[0]);
      cache[addr] = ok;
      saveCache();
      return ok;
    } catch {
      return null;
    }
  };

  const usd = (s) => Number(s.replace(/[^\d.]/g, '')) || 0;

  const CHAIN = (() => {
    const h = location.hostname;
    if (h.endsWith('etherscan.io')) return 1;        // Ethereum
    if (h.endsWith('gnosisscan.io')) return 100;     // Gnosis
    if (h.endsWith('arbiscan.io')) return 42161;     // Arbitrum One
    if (h.endsWith('polygonscan.com')) return 137;   // Polygon
    if (h.endsWith('bscscan.com')) return 56;        // BNB Chain
    if (h.endsWith('optimistic.etherscan.io')) return 10;        // OP
    return 1;                                        // fallback
  })();

  /* ---------- main ---------- */
  const clean = async () => {
    const dropdown = document.querySelector('#availableBalance');

    if (!dropdown) return;

    /* process ERC-20 rows */
    const rows = Array.from(dropdown.querySelectorAll('.list-custom-ERC20'));
    const sums = await Promise.all(
      rows.map(async (row) => {
        const href = row
          .querySelector('a[href^="/token/"]')
          .getAttribute('href');
        const addr = href.split('/token/')[1].split('?')[0];
        const ok = await exists(`eip155:${CHAIN}:${addr}`);
        if (!ok) {
          row.remove();
          return 0;
        }
        return usd(row.querySelector('.list-usd-value')?.textContent || '0');
      }),
    );

    /* update counters */
    const remaining = dropdown.querySelectorAll('.list-custom-ERC20').length;
    const header = dropdown.querySelector(
      '.list-custom-divider-ERC20 .fw-medium',
    );
    if (header) header.textContent = `ERC-20 Tokens (${remaining})`;

    const total = sums.reduce((a, b) => a + b, 0);
    const btn = document.querySelector('#dropdownMenuBalance');
    if (btn)
      btn.innerHTML = `$${total.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })} <span class="small text-muted">(${remaining} Tokens)</span>`;
  };
  clean()
})();
