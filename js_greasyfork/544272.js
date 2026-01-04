// ==UserScript==
// @name         Set Dice
// @version      1.2
// @description  Inject script untuk manipulasi hasil akhir roll dadu berdasarkan API
// @author       Zyetaa
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';
  
    const originalRandom = Math.random;
    let apiResponse = null;
    let isScriptActive = false;
    
    // Variabel untuk melacak pattern
    let patternValues = [];
    let patternIndex = 0;
    let currentPatternStr = ''; // Untuk melacak pattern saat ini
    
    // Load pattern state dari localStorage saat script dimulai
    function loadPatternState() {
      try {
        const savedPattern = localStorage.getItem('dicePattern');
        const savedIndex = localStorage.getItem('dicePatternIndex');
        
        if (savedPattern) {
          currentPatternStr = savedPattern;
          patternValues = savedPattern.split('-').map(val => val.trim().toLowerCase());
          patternIndex = parseInt(savedIndex) || 0;
          console.log('Pattern state loaded from localStorage:', {
            pattern: currentPatternStr,
            values: patternValues,
            index: patternIndex
          });
        }
      } catch (error) {
        console.error('Error loading pattern state:', error);
      }
    }
    
    // Save pattern state ke localStorage
    function savePatternState() {
      try {
        localStorage.setItem('dicePattern', currentPatternStr);
        localStorage.setItem('dicePatternIndex', patternIndex.toString());
      } catch (error) {
        console.error('Error saving pattern state:', error);
      }
    }
    
    // Load state saat script dimulai
    loadPatternState();
  
    async function fetchApiData() {
      try {
        const response = await fetch('https://kaptenxxi2-blublublublu.hf.space/set?__sign=eyJhbGciOiJFZERTQSJ9.eyJyZWFkIjp0cnVlLCJwZXJtaXNzaW9ucyI6eyJyZXBvLmNvbnRlbnQucmVhZCI6dHJ1ZX0sIm9uQmVoYWxmT2YiOnsia2luZCI6InVzZXIiLCJfaWQiOiI2ODI2YWMwMjk3NTQ0YmNiMjI5ZTEyMGIiLCJ1c2VyIjoiS2FwdGVuWHhpMiIsInNlc3Npb25JZCI6IjY4N2VkMjQ4OTcwMTU2ODU2ZTg4ZDNjZSJ9LCJpYXQiOjE3NTQwMzE3NTksInN1YiI6Ii9zcGFjZXMvS2FwdGVuWHhpMi9ibHVibHVibHVibHUiLCJleHAiOjE3NTQxMTgxNTksImlzcyI6Imh0dHBzOi8vaHVnZ2luZ2ZhY2UuY28ifQ.hupQLCW4CWjJKTOmBdT3ZQT1U9J5RGibE7UWSkIIfyhw_gHe8sloFemfQCDemsaIxpJouqBsYml1bPVvuzFTBg&key=cuanku');
        const data = await response.json();
        apiResponse = data;
        console.log('API Response:', apiResponse);
        
        // Parse pattern jika ada dan berubah
        if (apiResponse && apiResponse.value && apiResponse.value.includes('-')) {
          // Cek apakah pattern berubah
          if (currentPatternStr !== apiResponse.value) {
            currentPatternStr = apiResponse.value;
            parsePattern(apiResponse.value);
            savePatternState(); // Save state setelah pattern berubah
            console.log('Pattern changed to:', currentPatternStr);
          }
        } else {
          // Jika bukan pattern, reset pattern tracking
          if (currentPatternStr !== '') {
            currentPatternStr = '';
            patternValues = [];
            patternIndex = 0;
            savePatternState(); // Save state setelah reset
            console.log('Pattern reset (no pattern in response)');
          }
        }
      } catch (error) {
        console.error('Error fetching API data:', error);
      }
    }
    
    function parsePattern(patternStr) {
      // Parse pola string menjadi array nilai
      // Contoh: "b-k-b" -> ["b", "k", "b"]
      patternValues = patternStr.split('-').map(val => val.trim().toLowerCase());
      patternIndex = 0;
      console.log('Pattern parsed:', patternValues);
    }
    
    function getNextPatternValue() {
      if (patternValues.length === 0) {
        return null;
      }
      
      // Ambil nilai berdasarkan index saat ini
      const currentValue = patternValues[patternIndex];
      
      // Increment index untuk request berikutnya (loop jika sudah habis)
      patternIndex = (patternIndex + 1) % patternValues.length;
      
      // Save state setelah index berubah
      savePatternState();
      
      return currentValue;
    }
  
    setInterval(fetchApiData, 1000);
    fetchApiData();
  
    function generateFixedTotal(total, len = 9) {
        const maxTotal = len * 6;
        total = Math.min(total, maxTotal);
      
        const out = Array(len).fill(1);
        const freq = { 1: len };
        let sisa = total - len;
        let attempt = 0, maxAttempt = 20000;
      
        while (sisa > 0 && attempt < maxAttempt) {
          attempt++;
          const i = Math.floor(originalRandom() * len);
          const curr = out[i];
          if (curr >= 6) continue;
      
          const next = curr + 1;
          const countNext = freq[next] || 0;
      
          // Batasi maksimal kemunculan angka (kecuali terpaksa)
          const maxRepeat = Math.floor(len / 2); // misalnya: 4
          if (countNext >= maxRepeat) continue;
      
          // Prioritaskan angka yang jarang muncul
          const score = 1 / (1 + countNext);
          if (originalRandom() > score) continue;
      
          out[i] = next;
          freq[curr] = (freq[curr] || 0) - 1;
          freq[next] = (freq[next] || 0) + 1;
          sisa--;
        }
      
        if (attempt >= maxAttempt) {
          console.warn("Distribusi kurang optimal. Sisa:", sisa);
        }
      
        return out;
      }
      
  
    let i = 0, p = [];
  
    function set(tipe) {
      let total;
      if (tipe === "k") {
        total = Math.floor(originalRandom() * (31 - 20 + 1)) + 20;
      } else if (tipe === "b") {
        total = Math.floor(originalRandom() * (42 - 32 + 1)) + 32;
      } else {
        total = 30;
      }
  
      p = generateFixedTotal(total);
      i = 0;
      console.log("Total:", total);
      console.log("Generated array:", p);
      isScriptActive = true;
  
      Math.random = () => (p[i++ % p.length] - 0.0001) / 6;
  
      setTimeout(() => {
        isScriptActive = false;
        Math.random = originalRandom;
      }, 1000);
    }
  
    // Tunggu hingga tombol tersedia di DOM
    const interval = setInterval(() => {
      const btn = document.querySelector('[jsname="puTT7d"]');
      if (btn) {
        clearInterval(interval);
        btn.addEventListener('click', () => {
          let tipe;
          
          // Cek apakah ada pattern yang aktif
          if (patternValues.length > 0) {
            tipe = getNextPatternValue();
            console.log('Using pattern value:', tipe);
          } else if (apiResponse && apiResponse.value) {
            tipe = apiResponse.value;
          } else {
            tipe = "k";
          }
          
          set(tipe);
        });
      }
    }, 500);
  })();
  